from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional

from backend.app.database.connection import get_db
from backend.app.models.product import Product
from backend.app.services.redis_service import get_cache, set_cache, delete_cache


router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/search")
def search_products(
    name: Optional[str] = None,
    price_op: Optional[str] = Query(default=None, pattern="^(<|>|=)$"),
    price_value: Optional[float] = None,
    stock_op: Optional[str] = Query(default=None, pattern="^(<|>|=)$"),
    stock_value: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)

    if name:
        words = name.split()
        conditions = [Product.name.ilike(f"%{word}%") for word in words]
        query = query.filter(or_(*conditions))

    if price_op and price_value is not None:
        if price_op == ">":
            query = query.filter(Product.price > price_value)
        elif price_op == "<":
            query = query.filter(Product.price < price_value)
        elif price_op == "=":
            query = query.filter(Product.price == price_value)

    if stock_op and stock_value is not None:
        if stock_op == ">":
            query = query.filter(Product.stock > stock_value)
        elif stock_op == "<":
            query = query.filter(Product.stock < stock_value)
        elif stock_op == "=":
            query = query.filter(Product.stock == stock_value)

    results = query.all()

    if not results:
        raise HTTPException(status_code=404, detail="No products found")

    return results

@router.get("/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.is_active == True).all()
    return products

@router.get("/available")
def get_available_products(db: Session = Depends(get_db)):
    cached_products = get_cache("available_products")

    if cached_products is not None:
        return cached_products
    
    products = (
        db.query(Product)
        .filter(Product.stock > 0, Product.is_active == True)
        .all()
    )

    products_data = []

    for product in products:
        products_data.append({
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "stock": product.stock,
            "is_active": product.is_active,
            "image_url": product.image_url
        })

    set_cache("available_products", products_data)

    return products_data

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional

from backend.app.database.connection import get_db
from backend.app.models.product import Product
from backend.app.schemas.product import ProductCreate

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("/")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    new_product = Product(
        name=product.name,
        price=product.price,
        stock=product.stock
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {
        "message": "Product created successfully",
        "product_id": new_product.id,
        "name": new_product.name,
        "price": new_product.price,
        "stock": new_product.stock
    }

@router.get("/search")
def search_products(
    name: Optional[str] = None,
    price_op: Optional[str] = Query(default=None, pattern="^(<|>|=)$"),
    price_value: Optional[float] = None,
    stock_op: Optional[str] = Query(default=None, pattern="^(<|>|=)$"),
    stock_value: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)

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
    products = db.query(Product).all()
    return products
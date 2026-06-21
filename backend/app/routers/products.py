from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

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


@router.get("/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products
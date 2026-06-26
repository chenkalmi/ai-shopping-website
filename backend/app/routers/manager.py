from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import os
import shutil
from fastapi import UploadFile, File

from backend.app.services.redis_service import delete_cache
from backend.app.database.connection import get_db
from backend.app.models.product import Product
from backend.app.models.user import User
from backend.app.schemas.product import ProductCreate, ProductUpdate
from backend.app.services.auth_service import get_current_admin

router = APIRouter(prefix="/manager", tags=["Manager"])

@router.post("/upload-image")
def upload_product_image(
    image: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin)
):
    upload_folder = "backend/uploads"
    os.makedirs(upload_folder, exist_ok=True)

    file_path = f"{upload_folder}/{image.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    return {
        "image_url": f"/uploads/{image.filename}"
    }

@router.get("/products")
def get_manager_products(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    products = db.query(Product).filter(Product.is_active == True).all()
    return products


@router.post("/products")
def create_product(
    product: ProductCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_product = Product(
        name=product.name,
        price=product.price,
        stock=product.stock,
        image_url=product.image_url
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    delete_cache("available_products")

    return {
        "message": "Product created successfully",
        "product_id": new_product.id,
        "name": new_product.name,
        "price": new_product.price,
        "stock": new_product.stock,
        "image_url": new_product.image_url
    }


@router.put("/products/{product_id}")
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if not product.is_active:
        raise HTTPException(
            status_code=400,
            detail="Product has been removed from the store"
        )

    if product_data.name is not None:
        product.name = product_data.name

    if product_data.price is not None:
        product.price = product_data.price

    if product_data.stock is not None:
        product.stock = product_data.stock

    if product_data.image_url is not None:
        product.image_url = product_data.image_url

    db.commit()
    db.refresh(product)

    delete_cache("available_products")

    return {
        "message": "Product updated successfully",
        "product_id": product.id,
        "name": product.name,
        "price": product.price,
        "stock": product.stock,
        "image_url": product.image_url
    }


@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.is_active = False

    db.commit()
    db.refresh(product)

    delete_cache("available_products")

    return {
        "message": "Product removed from store",
        "product_id": product_id
    }
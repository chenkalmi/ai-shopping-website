from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.favorite import Favorite
from backend.app.models.product import Product
from backend.app.models.user import User
from backend.app.schemas.favorite import FavoriteCreate
from backend.app.services.auth_service import get_current_user


router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.post("/")
def add_favorite(
    favorite: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == favorite.product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )
    
    if not product.is_active:
        raise HTTPException(
            status_code=400,
            detail="Product is no longer available"
        )

    existing_favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.product_id == favorite.product_id
    ).first()

    if existing_favorite:
        raise HTTPException(
            status_code=400,
            detail="Product already in favorites"
        )

    new_favorite = Favorite(
        user_id=current_user.id,
        product_id=favorite.product_id
    )

    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)

    return {
        "message": "Product added to favorites",
        "favorite_id": new_favorite.id,
        "product_id": product.id,
        "product_name": product.name
    }

@router.get("/")
def get_my_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    favorites = db.query(Favorite).filter(
        Favorite.user_id == current_user.id
    ).all()

    products = []

    for favorite in favorites:
        product = db.query(Product).filter(
            Product.id == favorite.product_id
        ).first()

        if product:
            products.append({
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "stock": product.stock,
                "is_active": product.is_active,
                "image_url": product.image_url
            })

    return products

@router.delete("/{product_id}")
def remove_favorite(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.product_id == product_id
    ).first()

    if not favorite:
        raise HTTPException(
            status_code=404,
            detail="Favorite not found"
        )

    db.delete(favorite)
    db.commit()

    return {
        "message": "Product removed from favorites",
        "product_id": product_id
    }
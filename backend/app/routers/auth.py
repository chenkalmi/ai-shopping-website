from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.user import User
from backend.app.models.favorite import Favorite
from backend.app.models.chat_usage import ChatUsage
from backend.app.models.order import Order
from backend.app.models.order_item import OrderItem

from backend.app.schemas.user import UserCreate, UserLogin
from backend.app.services.security import (
    hash_password,
    verify_password,
    create_access_token
)
from backend.app.services.auth_service import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email or username already exists"
        )

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone=user.phone,
        country=user.country,
        city=user.city,
        username=user.username,
        password_hash=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "username": new_user.username
    }

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.username == form_data.username).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    if not verify_password(form_data.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token = create_access_token(
        {"sub": db_user.username}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Logged out successfully"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }

@router.delete("/me")
def delete_current_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(Favorite).filter(
        Favorite.user_id == current_user.id
    ).delete()

    db.query(ChatUsage).filter(
        ChatUsage.user_id == current_user.id
    ).delete()

    user_orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).all()

    for order in user_orders:
        db.query(OrderItem).filter(
            OrderItem.order_id == order.id
        ).delete()

    db.query(Order).filter(
        Order.user_id == current_user.id
    ).delete()

    db.delete(current_user)
    db.commit()

    return {"message": "User account deleted successfully"}
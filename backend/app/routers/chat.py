from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.chat_usage import ChatUsage
from backend.app.models.product import Product
from backend.app.models.user import User
from backend.app.schemas.chat import ChatRequest
from backend.app.services.auth_service import get_current_user
from backend.app.services.chat_service import get_chat_response


router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/")
def chat_with_assistant(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat_usage = db.query(ChatUsage).filter(
        ChatUsage.user_id == current_user.id
    ).first()

    if not chat_usage:
        chat_usage = ChatUsage(
            user_id=current_user.id,
            prompt_count=0
        )
        db.add(chat_usage)
        db.commit()
        db.refresh(chat_usage)

    if chat_usage.prompt_count >= 5:
        raise HTTPException(
            status_code=403,
            detail="You have reached the maximum number of chat prompts"
        )

    products = db.query(Product).all()

    available_products = []
    out_of_stock_products = []

    for product in products:
        product_text = (
            f"- {product.name} | price: {product.price} | stock: {product.stock}"
        )

        if product.stock > 0:
            available_products.append(product_text)
        else:
            out_of_stock_products.append(product_text)

    products_context = f"""
Available products:
{chr(10).join(available_products) if available_products else "No available products"}

Out of stock products:
{chr(10).join(out_of_stock_products) if out_of_stock_products else "No out of stock products"}
"""

    assistant_answer = get_chat_response(
        chat_request.message,
        products_context
    )

    chat_usage.prompt_count += 1
    db.commit()

    return {
        "user_message": chat_request.message,
        "assistant_answer": assistant_answer,
        "remaining_prompts": 5 - chat_usage.prompt_count
    }
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.chat_usage import ChatUsage
from backend.app.models.product import Product
from backend.app.models.user import User
from backend.app.models.chat_conversation import ChatConversation
from backend.app.models.chat_message import ChatMessage
from backend.app.schemas.chat import (
    ChatRequest,
    ChatConversationResponse,
    ChatMessageResponse
)
from backend.app.services.auth_service import get_current_user
from backend.app.services.chat_service import get_chat_response


router = APIRouter(prefix="/chat", tags=["Chat"])


def get_or_create_chat_usage(current_user: User, db: Session):
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

    return chat_usage


def build_products_context(db: Session):
    products = db.query(Product).filter(Product.is_active == True).all()

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

    return f"""
Available products:
{chr(10).join(available_products) if available_products else "No available products"}

Out of stock products:
{chr(10).join(out_of_stock_products) if out_of_stock_products else "No out of stock products"}
"""


def create_conversation_title(message: str):
    title = message.strip()

    if len(title) > 40:
        title = title[:40] + "..."

    if not title:
        title = "New chat"

    return title


@router.get("/conversations", response_model=list[ChatConversationResponse])
def get_chat_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conversations = db.query(ChatConversation).filter(
        ChatConversation.user_id == current_user.id
    ).order_by(ChatConversation.id.desc()).all()

    return conversations


@router.post("/conversations")
def create_chat_conversation(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat_usage = get_or_create_chat_usage(current_user, db)

    conversation = ChatConversation(
        user_id=current_user.id,
        title=create_conversation_title(chat_request.message)
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    user_message = ChatMessage(
        conversation_id=conversation.id,
        role="user",
        content=chat_request.message
    )

    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    products_context = build_products_context(db)

    assistant_answer = get_chat_response(
        chat_request.message,
        products_context
    )

    assistant_message = ChatMessage(
        conversation_id=conversation.id,
        role="assistant",
        content=assistant_answer
    )

    db.add(assistant_message)

    chat_usage.prompt_count += 1

    db.commit()
    db.refresh(assistant_message)

    return {
        "conversation_id": conversation.id,
        "title": conversation.title,
        "user_message": user_message.content,
        "assistant_answer": assistant_message.content,
        "remaining_prompts": 5 - chat_usage.prompt_count
    }


@router.get(
    "/conversations/{conversation_id}/messages",
    response_model=list[ChatMessageResponse]
)
def get_chat_messages(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conversation = db.query(ChatConversation).filter(
        ChatConversation.id == conversation_id,
        ChatConversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    messages = db.query(ChatMessage).filter(
        ChatMessage.conversation_id == conversation_id
    ).order_by(ChatMessage.id.asc()).all()

    return messages


@router.post("/conversations/{conversation_id}/messages")
def send_message_to_conversation(
    conversation_id: int,
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conversation = db.query(ChatConversation).filter(
        ChatConversation.id == conversation_id,
        ChatConversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    chat_usage = get_or_create_chat_usage(current_user, db)

    user_message = ChatMessage(
        conversation_id=conversation.id,
        role="user",
        content=chat_request.message
    )

    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    products_context = build_products_context(db)

    assistant_answer = get_chat_response(
        chat_request.message,
        products_context
    )

    assistant_message = ChatMessage(
        conversation_id=conversation.id,
        role="assistant",
        content=assistant_answer
    )

    db.add(assistant_message)

    chat_usage.prompt_count += 1

    db.commit()
    db.refresh(assistant_message)

    return {
        "conversation_id": conversation.id,
        "user_message": user_message.content,
        "assistant_answer": assistant_message.content,
        "remaining_prompts": 5 - chat_usage.prompt_count
    }
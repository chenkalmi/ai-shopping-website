from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.order import Order
from backend.app.models.order_item import OrderItem
from backend.app.models.product import Product
from backend.app.models.user import User
from backend.app.schemas.order import OrderItemCreate, OrderPurchase
from backend.app.services.auth_service import get_current_user


router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/items")
def add_item_to_temp_order(
    item: OrderItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == item.product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    temp_order = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.status == "TEMP"
    ).first()

    if not temp_order:
        temp_order = Order(
            user_id=current_user.id,
            status="TEMP"
        )
        db.add(temp_order)
        db.commit()
        db.refresh(temp_order)

    existing_item = db.query(OrderItem).filter(
        OrderItem.order_id == temp_order.id,
        OrderItem.product_id == item.product_id
    ).first()

    if existing_item:
        new_quantity = existing_item.quantity + item.quantity

        if new_quantity > product.stock:
            raise HTTPException(
                status_code=400,
                detail="Not enough stock available"
            )

        existing_item.quantity = new_quantity
    else:
        if item.quantity > product.stock:
            raise HTTPException(
                status_code=400,
                detail="Not enough stock available"
            )

        new_item = OrderItem(
            order_id=temp_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=product.price
        )
        db.add(new_item)

    db.commit()

    return {
        "message": "Item added to order",
        "order_id": temp_order.id,
        "product_id": product.id,
        "product_name": product.name,
        "quantity": item.quantity
    }

@router.get("/temp")
def get_temp_order(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    temp_order = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.status == "TEMP"
    ).first()

    if not temp_order:
        raise HTTPException(
            status_code=404,
            detail="No active order"
        )

    order_items = db.query(OrderItem).filter(
        OrderItem.order_id == temp_order.id
    ).all()

    items = []

    for item in order_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if product:
            items.append({
                "product_id": product.id,
                "name": product.name,
                "price": item.price_at_purchase,
                "quantity": item.quantity,
                "subtotal": item.price_at_purchase * item.quantity
            })

    return {
        "order_id": temp_order.id,
        "status": temp_order.status,
        "items": items,
        "total_price": sum(item["subtotal"] for item in items)
    }

@router.delete("/items/{product_id}")
def remove_item_from_temp_order(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    temp_order = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.status == "TEMP"
    ).first()

    if not temp_order:
        raise HTTPException(
            status_code=404,
            detail="No active order"
        )

    order_item = db.query(OrderItem).filter(
        OrderItem.order_id == temp_order.id,
        OrderItem.product_id == product_id
    ).first()

    if not order_item:
        raise HTTPException(
            status_code=404,
            detail="Product not found in order"
        )

    db.delete(order_item)
    db.commit()

    remaining_items = db.query(OrderItem).filter(
        OrderItem.order_id == temp_order.id
    ).all()

    if len(remaining_items) == 0:
        db.delete(temp_order)
        db.commit()

    return {
        "message": "Product removed from order"
    }

@router.post("/purchase")
def purchase_order(
    order_data: OrderPurchase,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    temp_order = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.status == "TEMP"
    ).first()

    if not temp_order:
        raise HTTPException(
            status_code=404,
            detail="No active order"
        )

    order_items = db.query(OrderItem).filter(
        OrderItem.order_id == temp_order.id
    ).all()

    if not order_items:
        raise HTTPException(
            status_code=400,
            detail="Order is empty"
        )

    total_price = 0

    for item in order_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        if item.quantity > product.stock:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for {product.name}"
            )

        total_price += item.price_at_purchase * item.quantity

    for item in order_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        product.stock -= item.quantity

    temp_order.shipping_address = order_data.shipping_address
    temp_order.total_price = total_price
    temp_order.status = "CLOSED"

    db.commit()
    db.refresh(temp_order)

    return {
        "message": "Order purchased successfully",
        "order_id": temp_order.id,
        "total_price": temp_order.total_price,
        "shipping_address": temp_order.shipping_address,
        "status": temp_order.status
    }

@router.get("/")
def get_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.status == "CLOSED"
    ).all()

    result = []

    for order in orders:
        result.append({
            "order_id": order.id,
            "order_date": order.order_date,
            "total_price": order.total_price,
            "status": order.status
        })

    return result

@router.get("/{order_id}")
def get_order_details(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order_items = db.query(OrderItem).filter(
        OrderItem.order_id == order.id
    ).all()

    items = []

    for item in order_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if product:
            items.append({
                "product_id": product.id,
                "name": product.name,
                "price": item.price_at_purchase,
                "quantity": item.quantity,
                "subtotal": item.price_at_purchase * item.quantity
            })

    return {
        "order_id": order.id,
        "order_date": order.order_date,
        "shipping_address": order.shipping_address,
        "total_price": order.total_price,
        "status": order.status,
        "items": items
    }
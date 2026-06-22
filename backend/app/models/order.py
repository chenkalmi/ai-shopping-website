from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime

from backend.app.database.connection import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    shipping_address = Column(String(255), nullable=True)
    total_price = Column(Float, default=0, nullable=False)
    status = Column(String(20), nullable=False, default="TEMP")
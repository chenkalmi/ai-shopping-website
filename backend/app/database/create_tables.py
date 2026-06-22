from backend.app.database.connection import engine, Base
from backend.app.models.user import User
from backend.app.models.product import Product
from backend.app.models.favorite import Favorite
from backend.app.models.order import Order
from backend.app.models.order_item import OrderItem

Base.metadata.create_all(bind=engine)

print("Tables created successfully")
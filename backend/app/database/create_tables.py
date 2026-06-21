from backend.app.database.connection import engine, Base
from backend.app.models.user import User
from backend.app.models.product import Product

Base.metadata.create_all(bind=engine)

print("Tables created successfully")
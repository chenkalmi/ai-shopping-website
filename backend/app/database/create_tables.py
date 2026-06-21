from backend.app.database.connection import engine, Base
from backend.app.models.user import User

Base.metadata.create_all(bind=engine)

print("Tables created successfully")
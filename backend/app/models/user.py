from sqlalchemy import Column, Integer, String
from backend.app.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)

    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(30), nullable=False)

    country = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)

    username = Column(String(100), unique=True, nullable=False)

    password_hash = Column(String(255), nullable=False)
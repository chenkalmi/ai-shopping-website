from sqlalchemy import Column, Integer, ForeignKey

from backend.app.database.connection import Base


class ChatUsage(Base):
    __tablename__ = "chat_usage"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    prompt_count = Column(Integer, nullable=False, default=0)
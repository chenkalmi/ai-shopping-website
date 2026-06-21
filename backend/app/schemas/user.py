from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    country: str
    city: str
    username: str
    password: str = Field(min_length=8)

class UserLogin(BaseModel):
    username: str
    password: str
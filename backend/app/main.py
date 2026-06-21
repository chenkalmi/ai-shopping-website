from fastapi import FastAPI
from backend.app.routers.auth import router as auth_router

app = FastAPI(title="AI Shopping Website")

app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "AI Shopping Website Backend is running"}

@app.get("/items")

def get_items():

    return [

        {"id": 1, "name": "Basketball", "price": 20},

        {"id": 2, "name": "Table", "price": 100}

    ]

@app.get("/users")

def get_users():

    return [

        {"id": 1, "username": "chen"},

        {"id": 2, "username": "admin"}

    ]
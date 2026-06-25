from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routers.auth import router as auth_router
from backend.app.routers.products import router as products_router
from backend.app.routers.favorites import router as favorites_router
from backend.app.routers.orders import router as orders_router
from backend.app.routers.chat import router as chat_router
from backend.app.routers.manager import router as manager_router


app = FastAPI(title="AI Shopping Website")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

app.include_router(products_router)

app.include_router(favorites_router)

app.include_router(orders_router)

app.include_router(chat_router)

app.include_router(manager_router)

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
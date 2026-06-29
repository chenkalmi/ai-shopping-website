import json

from backend.app.database.connection import SessionLocal
from backend.app.models.product import Product


def export_products():
    db = SessionLocal()

    products = db.query(Product).filter(Product.is_active == True).all()

    data = []

    for product in products:
        data.append({
            "name": product.name,
            "price": product.price,
            "stock": product.stock,
            "is_active": product.is_active,
            "image_url": product.image_url
        })

    with open("backend/app/database/seed_products.json", "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

    db.close()

    print(f"Exported {len(data)} products")


if __name__ == "__main__":
    export_products()
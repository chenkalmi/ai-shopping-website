import json

from backend.app.database.connection import SessionLocal
from backend.app.models.product import Product


def seed_products():
    db = SessionLocal()

    existing_products_count = db.query(Product).count()

    if existing_products_count > 0:
        print("Products already exist, skipping seed")
        db.close()
        return

    with open("backend/app/database/seed_products.json", "r", encoding="utf-8") as file:
        products = json.load(file)

    for product_data in products:
        product = Product(
            name=product_data["name"],
            price=product_data["price"],
            stock=product_data["stock"],
            is_active=product_data["is_active"],
            image_url=product_data["image_url"]
        )

        db.add(product)

    db.commit()
    db.close()

    print(f"Seeded {len(products)} products")


if __name__ == "__main__":
    seed_products()
import { useState } from "react";
import { addFavoriteApi } from "../services/favoritesApi";
import { addOrderItemApi } from "../services/ordersApi";
import "./ProductCard.css";
import { HiOutlineHeart, HiOutlineShoppingBag } from "react-icons/hi2";

function ProductCard({
    product,
    showFavoriteButton = true,
    showCartButton = true,
}) {
    const [message, setMessage] = useState("");

    const imageSrc = product.image_url
        ? product.image_url.startsWith("http")
            ? product.image_url
            : `http://127.0.0.1:8000${product.image_url}`
        : null;

    function addToFavorites() {
        addFavoriteApi(product.id)
            .then(() => {
                setMessage("Added to favorites");
                window.dispatchEvent(new Event("favoritesUpdated"));
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    setMessage("Please login first");
                } else {
                    setMessage(error.response?.data?.detail || "Could not add");
                }
            });
    }

    function addToCart() {
        addOrderItemApi(product.id, 1)
            .then(() => {
                setMessage("Added to cart");
                window.dispatchEvent(new Event("cartUpdated"));
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    setMessage("Please login first");
                } else {
                    setMessage(error.response?.data?.detail || "Could not add");
                }
            });
    }

    return (
        <div className="product-card">
            <div className="product-image-box">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className="product-image"
                    />
                ) : (
                    <div className="product-image-placeholder">
                        No Image
                    </div>
                )}

                {!product.is_active && (
                    <span className="product-badge">
                        Unavailable
                    </span>
                )}
            </div>

            <div className="product-info">
                <h3>{product.name}</h3>

                <p className="product-price">
                    ${product.price}
                </p>

                <p className="product-stock">
                    Stock: {product.stock}
                </p>

                <div className="product-actions">
                    {showFavoriteButton && (
                        <button
                            type="button"
                            onClick={addToFavorites}
                            title="Add to Favorites"
                        >
                            <HiOutlineHeart />
                        </button>
                    )}

                    {showCartButton && (
                        <button
                            type="button"
                            onClick={addToCart}
                            title="Add to Cart"
                        >
                            <HiOutlineShoppingBag />
                        </button>
                    )}
                </div>

                {message && (
                    <p className="product-message">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ProductCard;
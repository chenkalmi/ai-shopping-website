import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUserApi } from "../services/authApi";
import { getFavoritesApi, removeFavoriteApi } from "../services/favoritesApi";
import { getTempOrderApi, removeOrderItemApi, updateOrderItemQuantityApi } from "../services/ordersApi";
import "./Navbar.css";
import { getConversationsApi } from "../services/chatApi";
import chatbotLogo from "../assets/chatbot-logo.png";
import {
    HiOutlineShoppingBag,
    HiOutlineHeart,
    HiOutlineMagnifyingGlass,
    HiOutlineUser,
    HiOutlineLockClosed
} from "react-icons/hi2";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [showSearch, setShowSearch] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);

    const [name, setName] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minStock, setMinStock] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [showFavoritesDrawer, setShowFavoritesDrawer] = useState(false);
    const [drawerFavorites, setDrawerFavorites] = useState([]);

    const [cartCount, setCartCount] = useState(0);
    const [showCartDrawer, setShowCartDrawer] = useState(false);
    const [drawerCart, setDrawerCart] = useState(null);
    const [showChatDrawer, setShowChatDrawer] = useState(false);
    const [chatConversations, setChatConversations] = useState([]);

    useEffect(() => {
        if (token) {
            getCurrentUserApi()
                .then((response) => {
                    setCurrentUser(response.data);
                })
                .catch(() => {
                    setCurrentUser(null);
                });
        }
    }, [token]);

    useEffect(() => {
        function loadFavoritesCount() {
            if (token) {
                getFavoritesApi()
                    .then((response) => setFavoritesCount(response.data.length))
                    .catch(() => setFavoritesCount(0));
            } else {
                setFavoritesCount(0);
            }
        }

        loadFavoritesCount();

        window.addEventListener("favoritesUpdated", loadFavoritesCount);

        return () => {
            window.removeEventListener("favoritesUpdated", loadFavoritesCount);
        };
    }, [token]);

    useEffect(() => {

        function loadCartCount() {
            if (token) {
                getTempOrderApi()
                    .then((response) => {
                        setCartCount(response.data.items.length);
                    })
                    .catch(() => {
                        setCartCount(0);
                    });
            } else {
                setCartCount(0);
            }
        }

        loadCartCount();

        window.addEventListener("cartUpdated", loadCartCount);

        return () => {
            window.removeEventListener("cartUpdated", loadCartCount);
        };
    }, [token]);

    function handleLogout() {
        localStorage.removeItem("token");
        setShowAccountMenu(false);
        navigate("/login");
    }

    function handleSearch() {
        const params = new URLSearchParams();

        if (name) params.append("name", name);
        if (maxPrice) {
            params.append("price_op", "<");
            params.append("price_value", maxPrice);
        }
        if (minStock) {
            params.append("stock_op", ">");
            params.append("stock_value", minStock);
        }

        navigate(`/?${params.toString()}`);
        setShowSearch(false);
        setShowFilters(false);
    }

    function openFavoritesDrawer() {
        getFavoritesApi()
            .then((response) => {
                setDrawerFavorites(response.data);
                setFavoritesCount(response.data.length);
                setShowFavoritesDrawer(true);
            })
            .catch((error) => {
                console.error("Error loading favorites:", error);
                navigate("/login");
            });
    }

    function removeFromDrawer(productId) {
        removeFavoriteApi(productId)
            .then(() => {
                return getFavoritesApi();
            })
            .then((response) => {
                setDrawerFavorites(response.data);
                setFavoritesCount(response.data.length);
                window.dispatchEvent(new Event("favoritesUpdated"));
            })
            .catch((error) => {
                console.error("Error removing favorite:", error);
            });
    }

    function getImageSrc(imageUrl) {
        if (!imageUrl) return "";
        if (imageUrl.startsWith("http")) return imageUrl;
        return `http://127.0.0.1:8000${imageUrl}`;
    }

    function removeFromCartDrawer(productId) {
        removeOrderItemApi(productId)
            .then(() => {
                window.dispatchEvent(new Event("cartUpdated"));
                return getTempOrderApi();
            })
            .then((response) => {
                setDrawerCart(response.data);
                setCartCount(response.data.items.length);
            })
            .catch((error) => {
                console.error("Error removing cart item:", error);
                setDrawerCart(null);
                setCartCount(0);
                window.dispatchEvent(new Event("cartUpdated"));
            });
    }

    function updateCartDrawerQuantity(productId, quantity) {
        updateOrderItemQuantityApi(productId, quantity)
            .then(() => {
                return getTempOrderApi()
            })
            .then((response) => {
                setDrawerCart(response.data)
                setCartCount(response.data.items.length)
                window.dispatchEvent(new Event('cartUpdated'))
            })
            .catch((error) => {
                console.error(error)
                alert(error.response?.data?.detail || 'Could not update quantity')
            })
    }

    function openCartDrawer() {
        getTempOrderApi()
            .then((response) => {
                setDrawerCart(response.data)
                setCartCount(response.data.items.length)
                setShowCartDrawer(true)
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    navigate("/login")
                    return
                }

                setDrawerCart(null)
                setCartCount(0)
                setShowCartDrawer(true)
            })
    }

    function openChatDrawer() {
        getConversationsApi()
            .then((response) => {
                setChatConversations(response.data)
                setShowChatDrawer(true)
            })
            .catch((error) => {
                console.error("Error loading chat history:", error)

                if (error.response?.status === 401) {
                    navigate("/login")
                    return
                }

                setChatConversations([])
                setShowChatDrawer(true)
            })
    }

    return (
        <header className="navbar">
            <div className="navbar-left">

                <button
                    className="nav-icon"
                    onClick={openChatDrawer}
                >
                    <img
                        src={chatbotLogo}
                        alt="JERZO AI"
                        className="chatbot-icon"
                    />
                </button>
                <button
                    className="nav-icon nav-icon-with-badge"
                    onClick={openCartDrawer}
                >
                    <HiOutlineShoppingBag />

                    {cartCount > 0 && (
                        <span className="nav-badge">
                            {cartCount}
                        </span>
                    )}
                </button>

                <button
                    className="nav-icon nav-icon-with-badge"
                    onClick={openFavoritesDrawer}
                >
                    <HiOutlineHeart />
                    {favoritesCount > 0 && (
                        <span className="nav-badge">{favoritesCount}</span>
                    )}
                </button>

                <div className="search-menu">
                    <button className="nav-icon" onClick={() => setShowSearch(!showSearch)}>
                        <HiOutlineMagnifyingGlass />
                    </button>

                    {showSearch && (
                        <>
                            <div className="search-bubble">
                                <input
                                    type="text"
                                    placeholder="Search jerseys..."
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />

                                <button type="button" onClick={handleSearch}>Search</button>
                                <button type="button" onClick={() => setShowFilters(!showFilters)}>Filters</button>
                                <button type="button" onClick={() => setShowSearch(false)}>✕</button>
                            </div>

                            {showFilters && (
                                <div className="filters-panel">
                                    <input
                                        type="number"
                                        placeholder="Max price"
                                        value={maxPrice}
                                        onChange={(event) => setMaxPrice(event.target.value)}
                                    />

                                    <input
                                        type="number"
                                        placeholder="Min stock"
                                        value={minStock}
                                        onChange={(event) => setMinStock(event.target.value)}
                                    />

                                    <button type="button" onClick={handleSearch}>Apply Filters</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Link to="/" className="navbar-logo">JERZO</Link>

            <div className="navbar-right">
                <Link to="/" className="nav-link">All Jerseys</Link>

                {!token ? (
                    <div className="account-menu">
                        <button
                            className="nav-icon"
                            onClick={() => setShowAccountMenu(!showAccountMenu)}
                        >
                            <HiOutlineLockClosed />
                        </button>

                        <div className={`dropdown ${showAccountMenu ? "dropdown-open" : ""}`}>
                            <Link to="/login" onClick={() => setShowAccountMenu(false)}>Sign In</Link>
                            <Link to="/register" onClick={() => setShowAccountMenu(false)}>Sign Up</Link>
                        </div>
                    </div>
                ) : (
                    <div className="account-menu">
                        <button
                            className="nav-icon"
                            onClick={() => setShowAccountMenu(!showAccountMenu)}
                        >
                            <HiOutlineUser />
                        </button>

                        <div className={`dropdown ${showAccountMenu ? "dropdown-open" : ""}`}>

                            {currentUser?.is_admin && (
                                <Link
                                    to="/admin/products"
                                    onClick={() => setShowAccountMenu(false)}
                                >
                                    Admin Panel
                                </Link>
                            )}

                            <Link
                                to="/orders"
                                onClick={() => setShowAccountMenu(false)}
                            >
                                Order History
                            </Link>

                            <button type="button" onClick={handleLogout}>
                                Logout
                            </button>

                        </div>
                    </div>
                )}
            </div>

            {showFavoritesDrawer && (
                <div className="side-drawer">
                    <button
                        className="drawer-close"
                        onClick={() => setShowFavoritesDrawer(false)}
                    >
                        ✕
                    </button>

                    <h2>Wishlist</h2>

                    {drawerFavorites.length === 0 ? (
                        <p className="drawer-empty">Your wishlist is empty.</p>
                    ) : (
                        drawerFavorites.map((product) => (
                            <div className="drawer-item" key={product.id}>
                                {product.image_url && (
                                    <img src={getImageSrc(product.image_url)} alt={product.name} />
                                )}

                                <div>
                                    <h3>{product.name}</h3>
                                    <p>${product.price}</p>
                                </div>

                                <button
                                    className="drawer-remove"
                                    onClick={() => removeFromDrawer(product.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}

                    <button
                        className="drawer-main-btn"
                        onClick={() => {
                            setShowFavoritesDrawer(false);
                            navigate("/favorites");
                        }}
                    >
                        Go to Wishlist
                    </button>
                </div>
            )}

            {showCartDrawer && (
                <div className="side-drawer">
                    <button
                        className="drawer-close"
                        type="button"
                        onClick={() => setShowCartDrawer(false)}
                    >
                        ✕
                    </button>

                    <h2>Cart</h2>

                    {!drawerCart || drawerCart.items.length === 0 ? (
                        <p className="drawer-empty">Your cart is empty.</p>
                    ) : (
                        <>
                            {drawerCart.items.map((item) => (
                                <div className="drawer-item" key={item.product_id}>
                                    {item.image_url && (
                                        <img
                                            src={getImageSrc(item.image_url)}
                                            alt={item.product_name || item.name}
                                        />
                                    )}

                                    <div>
                                        <h3>{item.product_name || item.name}</h3>
                                        <p>${item.price_at_purchase || item.price}</p>
                                        <div className="drawer-quantity">
                                            <button
                                                onClick={() =>
                                                    updateCartDrawerQuantity(item.product_id, item.quantity - 1)
                                                }
                                                disabled={item.quantity <= 1}
                                            >
                                                −
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                onClick={() =>
                                                    updateCartDrawerQuantity(item.product_id, item.quantity + 1)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        className="drawer-remove"
                                        type="button"
                                        onClick={() => removeFromCartDrawer(item.product_id)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            <p className="drawer-total">
                                Total: ${drawerCart.total_price}
                            </p>
                        </>
                    )}

                    <button
                        className="drawer-main-btn"
                        type="button"
                        onClick={() => {
                            setShowCartDrawer(false)
                            navigate("/cart")
                        }}
                    >
                        Go to Cart
                    </button>
                </div>
            )}
            {showChatDrawer && (
                <div className="side-drawer">
                    <button
                        className="drawer-close"
                        type="button"
                        onClick={() => setShowChatDrawer(false)}
                    >
                        ✕
                    </button>

                    <h2>JERZO AI</h2>

                    <button
                        className="drawer-main-btn"
                        type="button"
                        onClick={() => {
                            setShowChatDrawer(false)
                            navigate("/chat")
                        }}
                    >
                        + New Chat
                    </button>

                    <h3 className="chat-history-title">History</h3>

                    <div className="chat-history-list">
                        {chatConversations.length === 0 ? (
                            <div className="chat-history-empty">
                                No chat history yet.
                            </div>
                        ) : (
                            chatConversations.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    className="chat-history-item"
                                    type="button"
                                    onClick={() => {
                                        setShowChatDrawer(false)
                                        navigate(`/chat?conversationId=${conversation.id}`)
                                    }}
                                >
                                    {conversation.title}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;
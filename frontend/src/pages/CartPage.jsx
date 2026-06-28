import './CartPage.css'
import { useEffect, useState } from 'react'
import {
    getTempOrderApi,
    removeOrderItemApi,
    purchaseOrderApi,
    updateOrderItemQuantityApi
} from '../services/ordersApi'

function CartPage() {
    const [tempOrder, setTempOrder] = useState(null)
    const [shippingAddress, setShippingAddress] = useState('')
    const [message, setMessage] = useState('')
    const [showAddressForm, setShowAddressForm] = useState(false)

    useEffect(() => {
        loadTempOrder()

        function refreshCartPage() {
            loadTempOrder()
        }

        window.addEventListener('cartUpdated', refreshCartPage)

        return () => {
            window.removeEventListener('cartUpdated', refreshCartPage)
        }
    }, [])

    function loadTempOrder() {
        getTempOrderApi()
            .then((response) => {
                setTempOrder(response.data)
            })
            .catch((error) => {
                console.error('Error loading cart:', error)
                setTempOrder(null)
            })
    }

    function removeItem(productId) {
        removeOrderItemApi(productId)
            .then(() => {
                setMessage('Item removed from cart')
                window.dispatchEvent(new Event('cartUpdated'))
                loadTempOrder()
            })
            .catch((error) => {
                console.error('Error removing item:', error)
                setMessage('Could not remove item')
            })
    }

    function updateQuantity(productId, newQuantity) {
        updateOrderItemQuantityApi(productId, newQuantity)
            .then(() => {
                loadTempOrder()
                window.dispatchEvent(new Event('cartUpdated'))
            })
            .catch((error) => {
                console.error(error)
                setMessage(
                    error.response?.data?.detail || 'Could not update quantity'
                )
            })
    }

    function purchaseOrder() {
        if (!shippingAddress) {
            setMessage('Please enter a shipping address')
            return
        }

        purchaseOrderApi(shippingAddress)
            .then(() => {
                setMessage('Order purchased successfully')
                setShippingAddress('')
                setShowAddressForm(false)
                window.dispatchEvent(new Event('cartUpdated'))
                loadTempOrder()
            })
            .catch((error) => {
                console.error('Error purchasing order:', error)
                setMessage(error.response?.data?.detail || 'Could not purchase order')
            })
    }

    function getImageSrc(imageUrl) {
        if (!imageUrl) return ''
        if (imageUrl.startsWith('http')) return imageUrl
        return `http://127.0.0.1:8000${imageUrl}`
    }

    return (
        <div className="cart-page">
            <h1 className="cart-title">SHOPPING CART</h1>

            {message && <p className="cart-message">{message}</p>}

            {!tempOrder || tempOrder.items.length === 0 ? (
                <p className="cart-empty">Your cart is empty.</p>
            ) : (
                <div className="cart-layout">
                    <div className="cart-table">
                        <div className="cart-header">
                            <span>Product</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span>Subtotal</span>
                            <span></span>
                        </div>

                        {tempOrder.items.map((item) => {
                            const price = item.price_at_purchase || item.price
                            const subtotal = price * item.quantity

                            return (
                                <div className="cart-row" key={item.product_id}>
                                    <div className="cart-product">
                                        {item.image_url && (
                                            <img
                                                src={getImageSrc(item.image_url)}
                                                alt={item.product_name || item.name}
                                            />
                                        )}

                                        <div>
                                            <h3>
                                                {item.product_name ||
                                                    item.name ||
                                                    `Product #${item.product_id}`}
                                            </h3>

                                            {!item.is_active && (
                                                <p className="cart-inactive">
                                                    This product is no longer available
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <p>${price}</p>

                                    <div className="cart-quantity">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(item.product_id, item.quantity - 1)
                                            }
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(item.product_id, item.quantity + 1)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="cart-subtotal">${subtotal.toFixed(2)}</p>

                                    <button
                                        type="button"
                                        className="cart-remove"
                                        onClick={() => removeItem(item.product_id)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-line">
                            <span>Subtotal</span>
                            <strong>${tempOrder.total_price}</strong>
                        </div>

                        <div className="summary-line">
                            <span>Shipping</span>
                            <strong>Calculated later</strong>
                        </div>

                        <div className="summary-total">
                            <span>Total</span>
                            <strong>${tempOrder.total_price}</strong>
                        </div>

                        {!showAddressForm ? (
                            <button
                                type="button"
                                className="checkout-btn"
                                onClick={() => setShowAddressForm(true)}
                            >
                                Purchase
                            </button>
                        ) : (
                            <div className="address-box">
                                <input
                                    type="text"
                                    placeholder="Shipping address"
                                    value={shippingAddress}
                                    onChange={(event) => setShippingAddress(event.target.value)}
                                />

                                <button type="button" onClick={purchaseOrder}>
                                    Confirm Purchase
                                </button>

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowAddressForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartPage
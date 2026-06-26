import { useEffect, useState } from 'react'
import {
    getTempOrderApi,
    removeOrderItemApi,
    purchaseOrderApi
} from '../services/ordersApi'

function CartPage() {
    const [tempOrder, setTempOrder] = useState(null)
    const [shippingAddress, setShippingAddress] = useState('')
    const [message, setMessage] = useState('')
    const [showAddressForm, setShowAddressForm] = useState(false)

    useEffect(() => {
        loadTempOrder()
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
                loadTempOrder()
            })
            .catch((error) => {
                console.error('Error removing item:', error)
                setMessage('Could not remove item')
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
                loadTempOrder()
            })
            .catch((error) => {
                console.error('Error purchasing order:', error)
                setMessage(error.response?.data?.detail || 'Could not purchase order')
            })
    }

    function getImageSrc(imageUrl) {
        if (!imageUrl) {
            return ''
        }

        if (imageUrl.startsWith('http')) {
            return imageUrl
        }

        return `http://127.0.0.1:8000${imageUrl}`
    }

    return (
        <div>
            <h1>Cart</h1>

            {!tempOrder && <p>Your cart is empty</p>}

            {tempOrder && (
                <div>
                    <p>Total price: {tempOrder.total_price}</p>

                    {tempOrder.items.map((item) => (
                        <div key={item.product_id}>
                            {item.image_url && (
                                <img
                                    src={getImageSrc(item.image_url)}
                                    alt={item.name}
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        objectFit: 'cover'
                                    }}
                                />
                            )}

                            <h3>
                                {item.product_name || item.name || `Product #${item.product_id}`}
                            </h3>

                            {!item.is_active && (
                                <p style={{ color: 'red' }}>
                                    ❌ This product is no longer available
                                </p>
                            )}

                            <p>Quantity: {item.quantity}</p>
                            <p>Price: {item.price_at_purchase || item.price}</p>

                            <p>
                                Subtotal:{' '}
                                {(item.price_at_purchase || item.price) * item.quantity}
                            </p>

                            <button
                                type="button"
                                onClick={() => removeItem(item.product_id)}
                            >
                                🗑️ Remove
                            </button>
                        </div>
                    ))}

                    {!showAddressForm && (
                        <button
                            type="button"
                            onClick={() => setShowAddressForm(true)}
                        >
                            Purchase
                        </button>
                    )}

                    {showAddressForm && (
                        <div>
                            <input
                                type="text"
                                placeholder="Shipping address"
                                value={shippingAddress}
                                onChange={(event) =>
                                    setShippingAddress(event.target.value)
                                }
                            />

                            <button
                                type="button"
                                onClick={purchaseOrder}
                            >
                                Confirm Purchase
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowAddressForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            )}

            <p>{message}</p>
        </div>
    )
}

export default CartPage
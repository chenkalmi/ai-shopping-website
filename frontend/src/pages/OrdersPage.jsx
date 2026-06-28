import './OrdersPage.css'
import { useEffect, useState } from 'react'
import {
    getOrdersApi,
    getOrderDetailsApi
} from '../services/ordersApi'

function OrdersPage() {
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        loadOrders()
    }, [])

    function loadOrders() {
        getOrdersApi()
            .then((response) => {
                setOrders(response.data)
            })
            .catch((error) => {
                console.error('Error loading orders:', error)
                setMessage('Could not load orders')
            })
    }

    function loadOrderDetails(orderId) {
        getOrderDetailsApi(orderId)
            .then((response) => {
                setSelectedOrder(response.data)
            })
            .catch((error) => {
                console.error('Error loading order details:', error)
                setMessage('Could not load order details')
            })
    }

    function getImageSrc(imageUrl) {
        if (!imageUrl) return ''
        if (imageUrl.startsWith('http')) return imageUrl
        return `http://127.0.0.1:8000${imageUrl}`
    }

    function toggleOrderDetails(orderId) {
        if (selectedOrder && selectedOrder.order_id === orderId) {
            setSelectedOrder(null)
        } else {
            loadOrderDetails(orderId)
        }
    }

    return (
        <div className="orders-page">
            <h1 className="orders-title">ORDER HISTORY</h1>

            {message && <p className="orders-message">{message}</p>}

            {orders.length === 0 ? (
                <p className="orders-empty">You have no orders yet.</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div className="order-card" key={order.order_id}>
                            <div className="order-summary">
                                <div>
                                    <h2>Order #{order.order_id}</h2>
                                    <p className="order-status">Status: {order.status}</p>
                                </div>

                                <div className="order-price">
                                    ${order.total_price}
                                </div>

                                <button
                                    type="button"
                                    className="order-details-btn"
                                    onClick={() => toggleOrderDetails(order.order_id)}
                                >
                                    {selectedOrder?.order_id === order.order_id
                                        ? 'Hide Details'
                                        : 'View Details'}
                                </button>
                            </div>

                            {selectedOrder && selectedOrder.order_id === order.order_id && (
                                <div className="order-details">
                                    <div className="order-details-header">
                                        <p>
                                            <strong>Shipping Address:</strong>{' '}
                                            {selectedOrder.shipping_address}
                                        </p>

                                        <p>
                                            <strong>Total:</strong> ${selectedOrder.total_price}
                                        </p>
                                    </div>

                                    <div className="order-items">
                                        {selectedOrder.items.map((item) => (
                                            <div className="order-item" key={item.product_id}>
                                                {item.image_url && (
                                                    <img
                                                        src={getImageSrc(item.image_url)}
                                                        alt={item.product_name || item.name}
                                                    />
                                                )}

                                                <div className="order-item-info">
                                                    <h3>
                                                        {item.product_name ||
                                                            item.name ||
                                                            `Product #${item.product_id}`}
                                                    </h3>

                                                    {!item.is_active && (
                                                        <p className="inactive-product">
                                                            This product is no longer available
                                                        </p>
                                                    )}

                                                    <p>Quantity: {item.quantity}</p>
                                                    <p>Price: ${item.price_at_purchase || item.price}</p>
                                                    <p>
                                                        Subtotal: $
                                                        {(item.price_at_purchase || item.price) *
                                                            item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default OrdersPage
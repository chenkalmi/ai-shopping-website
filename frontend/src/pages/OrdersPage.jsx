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

    return (
        <div>
            <h1>Orders</h1>

            <p>{message}</p>

            <h2>Order History</h2>

            {orders.map((order) => (
                <div key={order.order_id}>
                    <h3>Order #{order.order_id}</h3>
                    <p>Status: {order.status}</p>
                    <p>Total price: {order.total_price}</p>

                    <button
                        type="button"
                        onClick={() => loadOrderDetails(order.order_id)}
                    >
                        View Details
                    </button>

                    {selectedOrder && selectedOrder.order_id === order.order_id && (
                        <div>
                            <h2>Order Details</h2>

                            <p>Order ID: {selectedOrder.order_id}</p>
                            <p>Status: {selectedOrder.status}</p>
                            <p>Shipping Address: {selectedOrder.shipping_address}</p>
                            <p>Total Price: {selectedOrder.total_price}</p>

                            <h3>Products</h3>

                            {selectedOrder.items.map((item) => (
                                <div key={item.product_id}>
                                    {item.image_url && (
                                        <img
                                            src={
                                                item.image_url.startsWith('http')
                                                    ? item.image_url
                                                    : `http://127.0.0.1:8000${item.image_url}`
                                            }
                                            alt={item.name}
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )}

                                    <h4>
                                        {item.product_name || item.name || `Product #${item.product_id}`}
                                    </h4>

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
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
export default OrdersPage
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

function getAuthHeaders() {
  const token = localStorage.getItem('token')

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export function addOrderItemApi(productId, quantity) {
  return axios.post(
    `${API_BASE_URL}/orders/items`,
    {
      product_id: productId,
      quantity: quantity
    },
    getAuthHeaders()
  )
}

export function getTempOrderApi() {
  return axios.get(
    `${API_BASE_URL}/orders/temp`,
    getAuthHeaders()
  )
}

export function removeOrderItemApi(productId) {
  return axios.delete(
    `${API_BASE_URL}/orders/items/${productId}`,
    getAuthHeaders()
  )
}

export function purchaseOrderApi(shippingAddress) {
  return axios.post(
    `${API_BASE_URL}/orders/purchase`,
    {
      shipping_address: shippingAddress
    },
    getAuthHeaders()
  )
}

export function getOrdersApi() {
  return axios.get(
    `${API_BASE_URL}/orders/`,
    getAuthHeaders()
  )
}

export function getOrderDetailsApi(orderId) {
  return axios.get(
    `${API_BASE_URL}/orders/${orderId}`,
    getAuthHeaders()
  )
}
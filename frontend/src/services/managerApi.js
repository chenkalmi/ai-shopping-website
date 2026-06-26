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

export function getManagerProductsApi() {
  return axios.get(
    `${API_BASE_URL}/manager/products`,
    getAuthHeaders()
  )
}

export function createManagerProductApi(productData) {
  return axios.post(
    `${API_BASE_URL}/manager/products`,
    productData,
    getAuthHeaders()
  )
}

export function updateManagerProductApi(productId, productData) {
  return axios.put(
    `${API_BASE_URL}/manager/products/${productId}`,
    productData,
    getAuthHeaders()
  )
}

export function deleteManagerProductApi(productId) {
  return axios.delete(
    `${API_BASE_URL}/manager/products/${productId}`,
    getAuthHeaders()
  )
}

export function uploadManagerProductImageApi(imageFile) {
  const token = localStorage.getItem('token')
  const formData = new FormData()

  formData.append('image', imageFile)

  return axios.post(`${API_BASE_URL}/manager/upload-image`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
}
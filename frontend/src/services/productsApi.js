import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

export function getAvailableProducts() {
  return axios.get(`${API_BASE_URL}/products/available`)
}

export function searchProductsApi(params) {
  return axios.get(`${API_BASE_URL}/products/search`, {
    params: params
  })
}
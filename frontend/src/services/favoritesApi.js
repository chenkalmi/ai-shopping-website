import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

export function addFavoriteApi(productId) {
  const token = localStorage.getItem('token')

  return axios.post(
    `${API_BASE_URL}/favorites/`,
    { product_id: productId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}

export function getFavoritesApi() {
  const token = localStorage.getItem('token')

  return axios.get(`${API_BASE_URL}/favorites/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function removeFavoriteApi(productId) {
  const token = localStorage.getItem('token')

  return axios.delete(`${API_BASE_URL}/favorites/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
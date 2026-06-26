import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

export function loginApi(username, password) {
  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)

  return axios.post(`${API_BASE_URL}/auth/login`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}


export function registerApi(userData) {
  return axios.post(`${API_BASE_URL}/auth/register`, userData)
}

export function getCurrentUserApi() {
  const token = localStorage.getItem('token')

  return axios.get(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


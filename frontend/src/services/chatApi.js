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

export function sendChatMessageApi(message) {
  return axios.post(
    `${API_BASE_URL}/chat/`,
    {
      message: message
    },
    getAuthHeaders()
  )
}
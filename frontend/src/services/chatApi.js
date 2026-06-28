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

export function createConversationApi(message) {
  return axios.post(
    `${API_BASE_URL}/chat/conversations`,
    { message },
    getAuthHeaders()
  )
}

export function getConversationsApi() {
  return axios.get(
    `${API_BASE_URL}/chat/conversations`,
    getAuthHeaders()
  )
}

export function getConversationMessagesApi(conversationId) {
  return axios.get(
    `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
    getAuthHeaders()
  )
}

export function sendMessageToConversationApi(conversationId, message) {
  return axios.post(
    `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
    { message },
    getAuthHeaders()
  )
}
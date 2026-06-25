import { useState } from 'react'
import { sendChatMessageApi } from '../services/chatApi'

function ChatPage() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')

  function sendMessage() {
    sendChatMessageApi(message)
      .then((response) => {
        setResponse(response.data.response)
      })
      .catch((error) => {
        console.error('Error sending message:', error)
        setResponse(
          error.response?.data?.detail || 'Could not send message'
        )
      })
  }

  return (
    <div>
      <h1>AI Shopping Assistant</h1>

     <textarea
        placeholder="Hi! I'm your AI shopping assistant. Ask me anything about our products..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        style={{
            width: '700px',
            height: '180px',
            padding: '12px',
            fontSize: '16px',
            resize: 'vertical'
        }}
    />

      <br />

      <button type="button" onClick={sendMessage}>
        Send
      </button>

      <h2>Response</h2>

      <p>{response}</p>
    </div>
  )
}

export default ChatPage
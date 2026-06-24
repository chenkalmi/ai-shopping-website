import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '../services/api'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  function loginUser() {
    loginApi(username, password)
      .then((response) => {
        localStorage.setItem('token', response.data.access_token)
        setMessage('Login successful')
        navigate('/')
      })
      .catch((error) => {
        console.error('Login error:', error)
        setMessage('Invalid username or password')
      })
  }

  return (
    <div>
      <h1>Login</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="button" onClick={loginUser}>
        Login
      </button>

      <p>{message}</p>
    </div>
  )
}

export default LoginPage
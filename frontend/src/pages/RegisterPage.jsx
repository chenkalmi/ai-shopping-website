import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerApi } from '../services/authApi'

function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    username: '',
    password: ''
  })

  const [message, setMessage] = useState('')

  function updateFormData(fieldName, value) {
    setFormData({
      ...formData,
      [fieldName]: value
    })
  }

  function registerUser() {
    registerApi(formData)
      .then(() => {
        setMessage('Registration successful. You can now sign in.')
        navigate('/login')
      })
      .catch((error) => {
        console.error('Register error:', error)
        setMessage(error.response?.data?.detail || 'Could not register user')
      })
  }

  return (
    <div>
      <h1>Create Account</h1>

      <input
        type="text"
        placeholder="First name"
        value={formData.first_name}
        onChange={(event) => updateFormData('first_name', event.target.value)}
      />

      <input
        type="text"
        placeholder="Last name"
        value={formData.last_name}
        onChange={(event) => updateFormData('last_name', event.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(event) => updateFormData('email', event.target.value)}
      />

      <input
        type="text"
        placeholder="Phone"
        value={formData.phone}
        onChange={(event) => updateFormData('phone', event.target.value)}
      />

      <input
        type="text"
        placeholder="Country"
        value={formData.country}
        onChange={(event) => updateFormData('country', event.target.value)}
      />

      <input
        type="text"
        placeholder="City"
        value={formData.city}
        onChange={(event) => updateFormData('city', event.target.value)}
      />

      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(event) => updateFormData('username', event.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(event) => updateFormData('password', event.target.value)}
      />

      <button type="button" onClick={registerUser}>
        Create Account
      </button>

      <p>
        Already have an account?{' '}
        <button type="button" onClick={() => navigate('/login')}>
          Sign in
        </button>
      </p>

      <p>{message}</p>
    </div>
  )
}

export default RegisterPage
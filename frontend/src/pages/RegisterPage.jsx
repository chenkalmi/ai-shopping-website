import './RegisterPage.css'
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
                const detail = error.response?.data?.detail

                if (Array.isArray(detail)) {
                    setMessage(detail[0]?.msg || 'Could not register user')
                } else if (typeof detail === 'string') {
                    setMessage(detail)
                } else {
                    setMessage('Could not register user')
                }
            })
    }

    return (
        <div className="register-page">
            <div className="register-card">
                <h1>Create Account</h1>

                <p className="register-subtitle">
                    Join JERZO and start building your jersey collection.
                </p>

                <div className="register-grid">
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
                </div>

                <button
                    className="register-button"
                    type="button"
                    onClick={registerUser}
                >
                    Create Account
                </button>

                {message && <p className="register-message">{message}</p>}

                <p className="register-login-link">
                    Already have an account?
                    <span onClick={() => navigate('/login')}>
                        {' '}Sign In
                    </span>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage
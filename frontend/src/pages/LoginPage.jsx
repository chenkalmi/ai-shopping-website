import { useState } from 'react'
import './LoginPage.css'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '../services/authApi'

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
        <div className="login-page">
            <div className="login-card">
                <h1>Sign In</h1>

                <p className="login-subtitle">
                    Welcome back! Sign in to continue shopping.
                </p>

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

                <button
                    className="login-button"
                    type="button"
                    onClick={loginUser}
                >
                    Sign In
                </button>

                {message && <p className="login-message">{message}</p>}

                <p className="login-register-link">
                    Don't have an account?
                    <span onClick={() => navigate('/register')}>
                        {" "}Sign Up
                    </span>
                </p>
            </div>
        </div>
    )
}

export default LoginPage
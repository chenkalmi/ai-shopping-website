import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  function logout() {
    localStorage.removeItem('token')
    setShowMenu(false)
    navigate('/')
  }

  return (
    <nav>
      <Link to="/" style={{ marginRight: '20px' }}>
        🏠 Home
      </Link>

      <button type="button" onClick={() => setShowMenu(!showMenu)}>
        👤 Account ▼
      </button>

      {showMenu && (
        <div>
          {!token && (
            <>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false)
                  navigate('/login')
                }}
              >
                🔐 Sign in
              </button>

              <p>
                New customer?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false)
                    navigate('/register')
                  }}
                >
                  📝 Register here
                </button>
              </p>
            </>
          )}

          {token && (
            <>
              <Link to="/favorites" onClick={() => setShowMenu(false)}>
                ❤️ Favorites
              </Link>

              <br />

              <Link to="/cart" onClick={() => setShowMenu(false)}>
                🛒 Cart
              </Link>

              <br />

              <Link to="/orders" onClick={() => setShowMenu(false)}>
                📦 Orders
              </Link>

              <br />

              <Link to="/chat" onClick={() => setShowMenu(false)}>
                🤖 AI Chat
              </Link>

              <br />

              <button type="button" onClick={logout}>
                🚪 Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
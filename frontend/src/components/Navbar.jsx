import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav>
      <Link to="/">Home</Link> |{' '}
      <Link to="/login">Login</Link> |{' '}
      <Link to="/register">Register</Link> |{' '}
      <Link to="/favorites">Favorites</Link> |{' '}
      <Link to="/orders">Orders</Link> |{' '}
      <Link to="/chat">Chat</Link>

      {token && (
        <>
          {' | '}
          <button type="button" onClick={logout}>
            Logout
          </button>
        </>
      )}
    </nav>
  )
}

export default Navbar
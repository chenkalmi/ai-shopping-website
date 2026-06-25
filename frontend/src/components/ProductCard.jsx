import { useState } from 'react'
import { addFavoriteApi } from '../services/favoritesApi'
import { addOrderItemApi } from '../services/ordersApi'

function ProductCard({ product, showFavoriteButton = true, showCartButton = true }) {
  const [message, setMessage] = useState('')

  function addToFavorites() {
    addFavoriteApi(product.id)
      .then(() => {
        setMessage('Added to favorites')
      })
      .catch((error) => {
        console.error('Error adding favorite:', error)
        if (error.response?.status === 401) {
            setMessage('Please login before adding items to favorites')
            } else {
            setMessage(error.response?.data?.detail || 'Could not add to favorites')
            }
      })
  }

  function addToCart() {
    addOrderItemApi(product.id, 1)
      .then(() => {
        setMessage('Added to cart')
      })
      .catch((error) => {
        console.error('Error adding to cart:', error)
        if (error.response?.status === 401) {
            setMessage('Please login before adding items to cart')
            } else {
            setMessage(error.response?.data?.detail || 'Could not add to cart')
            }
      })
  }

  return (
    <div>
      <h3>{product.name}</h3>
      <p>Price: {product.price}</p>
      <p>Stock: {product.stock}</p>

      {showFavoriteButton && (
        <button type="button" onClick={addToFavorites}>
          ❤️ Add to Favorites
        </button>
      )}

      {showCartButton && (
        <button type="button" onClick={addToCart}>
          🛒 Add to Cart
        </button>
      )}

      <p>{message}</p>
    </div>
  )
}

export default ProductCard
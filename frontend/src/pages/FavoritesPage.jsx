import './FavoritesPage.css'
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getFavoritesApi, removeFavoriteApi } from '../services/favoritesApi'

function FavoritesPage() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    loadFavorites()
  }, [])

  function loadFavorites() {
    getFavoritesApi()
      .then((response) => {
        setFavorites(response.data)
      })
      .catch((error) => {
        console.error('Error loading favorites:', error)
      })
  }

  function removeFavorite(productId) {
    removeFavoriteApi(productId)
      .then(() => {
        window.dispatchEvent(new Event('favoritesUpdated'))
        loadFavorites()
      })
      .catch((error) => {
        console.error('Error removing favorite:', error)
      })
  }

  return (
    <div className="favorites-page">
      <h1 className="favorites-title">MY WISHLIST</h1>

      {favorites.length === 0 ? (
        <p className="favorites-empty">Your wishlist is empty.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((product) => (
            <div className="favorite-card-wrapper" key={product.id}>
              <ProductCard
                product={product}
                showFavoriteButton={false}
              />

              <button
                type="button"
                className="favorite-remove-btn"
                onClick={() => removeFavorite(product.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage
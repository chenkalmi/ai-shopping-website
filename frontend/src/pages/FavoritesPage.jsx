import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getFavoritesApi,removeFavoriteApi } from '../services/favoritesApi'
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
        loadFavorites()
      })
      .catch((error) => {
        console.error('Error removing favorite:', error)
      })
  }

  return (
    <div>
      <h1>Favorites</h1>

      {favorites.map((product) => (
        <div key={product.id}>
          <ProductCard product={product} showFavoriteButton={false} />
          <button type="button" onClick={() => removeFavorite(product.id)}>
            🗑️ Remove 
          </button>
        </div>
      ))}
    </div>
  )
}

export default FavoritesPage
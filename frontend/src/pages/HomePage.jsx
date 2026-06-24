import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import {
  getAvailableProducts,
  searchProductsApi
} from '../services/api'

function HomePage() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [priceValue, setPriceValue] = useState('')
  const [stockValue, setStockValue] = useState('')

  useEffect(() => {
    getAvailableProducts()
      .then((response) => {
        console.log(response.data)
        setProducts(response.data)
      })
      .catch((error) => {
        console.error('Error loading products:', error)
      })
  }, [])

  function searchProducts() {
    const params = {}

    if (searchTerm) {
      params.name = searchTerm
    }

    if (priceValue) {
      params.price_op = '<'
      params.price_value = priceValue
    }

    if (stockValue) {
      params.stock_op = '>'
      params.stock_value = stockValue
    }

    searchProductsApi(params)
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        console.error('Error searching products:', error)
        setProducts([])
      })
  }

  function resetSearch() {
    setSearchTerm('')
    setPriceValue('')
    setStockValue('')

    getAvailableProducts()
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        console.error('Error loading products:', error)
      })
  }

  return (
    <div>
      <h1>AI Shopping Website</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <input
        type="number"
        placeholder="Max price"
        value={priceValue}
        onChange={(event) => setPriceValue(event.target.value)}
      />

      <input
        type="number"
        placeholder="Min stock"
        value={stockValue}
        onChange={(event) => setStockValue(event.target.value)}
      />

      <button type="button" onClick={searchProducts}>
        🔍 Search
      </button>

      <button type="button" onClick={resetSearch}>
        Reset
      </button>

      <h2>Available Products</h2>
      <p>Number of products: {products.length}</p>

      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default HomePage
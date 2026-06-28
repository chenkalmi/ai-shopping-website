import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import heroImage from "../assets/hero.png";
import "./HomePage.css";
import ProductCard from '../components/ProductCard'
import {
  getAvailableProducts,
  searchProductsApi
} from '../services/productsApi'

function HomePage() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [priceValue, setPriceValue] = useState('')
  const [stockValue, setStockValue] = useState('')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const params = {}

    const name = searchParams.get('name')
    const priceOp = searchParams.get('price_op')
    const priceValue = searchParams.get('price_value')
    const stockOp = searchParams.get('stock_op')
    const stockValue = searchParams.get('stock_value')

    if (name) params.name = name
    if (priceOp && priceValue) {
      params.price_op = priceOp
      params.price_value = priceValue
    }
    if (stockOp && stockValue) {
      params.stock_op = stockOp
      params.stock_value = stockValue
    }

    if (Object.keys(params).length > 0) {
      searchProductsApi(params)
        .then((response) => {
          setProducts(response.data)
        })
        .catch((error) => {
          console.error('Error searching products:', error)
          setProducts([])
        })
    } else {
      getAvailableProducts()
        .then((response) => {
          setProducts(response.data)
        })
        .catch((error) => {
          console.error('Error loading products:', error)
        })
    }
  }, [searchParams])

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
    <div className="home-page">

      <section className="hero-section">
        <img
          src={heroImage}
          alt="Football jerseys"
          className="hero-image"
        />
      </section>

      <section className="products-section">

        <div className="hero-text">

          <h1 className="hero-quote">
            More than a jersey.
            <br />
            <span>
              A memory. A passion. A lifestyle.
            </span>
          </h1>

        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </section>

    </div>
  )
}

export default HomePage
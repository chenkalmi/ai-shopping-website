import { useEffect, useState } from 'react'
import './AdminProductsPage.css'
import {
    getManagerProductsApi,
    createManagerProductApi,
    updateManagerProductApi,
    deleteManagerProductApi,
    uploadManagerProductImageApi
} from '../services/managerApi'

function AdminProductsPage() {
    const [products, setProducts] = useState([])
    const [message, setMessage] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingProductId, setEditingProductId] = useState(null)

    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        stock: '',
        image: null
    })

    useEffect(() => {
        loadProducts()
    }, [])

    function loadProducts() {
        getManagerProductsApi()
            .then((response) => {
                setProducts(response.data)
            })
            .catch((error) => {
                console.error('Error loading products:', error)
                setMessage(error.response?.data?.detail || 'Could not load products')
            })
    }

    function updateNewProduct(fieldName, value) {
        setNewProduct({
            ...newProduct,
            [fieldName]: value
        })
    }

    function updateProductField(productId, fieldName, value) {
        setProducts(
            products.map((product) =>
                product.id === productId
                    ? { ...product, [fieldName]: value }
                    : product
            )
        )
    }

    function getImageSrc(imageUrl) {
        if (!imageUrl) {
            return ''
        }

        if (imageUrl.startsWith('http')) {
            return imageUrl
        }

        return `http://127.0.0.1:8000${imageUrl}`
    }

    function createProduct() {
        if (newProduct.image) {
            uploadManagerProductImageApi(newProduct.image)
                .then((imageResponse) => {
                    return createManagerProductApi({
                        name: newProduct.name,
                        price: Number(newProduct.price),
                        stock: Number(newProduct.stock),
                        image_url: imageResponse.data.image_url
                    })
                })
                .then(() => {
                    setMessage('Product created successfully')
                    setNewProduct({ name: '', price: '', stock: '', image: null })
                    setShowAddForm(false)
                    loadProducts()
                })
                .catch((error) => {
                    console.error('Error creating product:', error)
                    setMessage(error.response?.data?.detail || 'Could not create product')
                })
        } else {
            createManagerProductApi({
                name: newProduct.name,
                price: Number(newProduct.price),
                stock: Number(newProduct.stock),
                image_url: null
            })
                .then(() => {
                    setMessage('Product created successfully')
                    setNewProduct({ name: '', price: '', stock: '', image: null })
                    setShowAddForm(false)
                    loadProducts()
                })
                .catch((error) => {
                    console.error('Error creating product:', error)
                    setMessage(error.response?.data?.detail || 'Could not create product')
                })
        }
    }

    function updateProduct(product) {
        if (product.image) {
            uploadManagerProductImageApi(product.image)
                .then((imageResponse) => {
                    return updateManagerProductApi(product.id, {
                        name: product.name,
                        price: Number(product.price),
                        stock: Number(product.stock),
                        image_url: imageResponse.data.image_url
                    })
                })
                .then(() => {
                    setMessage('Product updated successfully')
                    setEditingProductId(null)
                    loadProducts()
                })
                .catch((error) => {
                    console.error('Error updating product:', error)
                    setMessage(error.response?.data?.detail || 'Could not update product')
                })
        } else {
            updateManagerProductApi(product.id, {
                name: product.name,
                price: Number(product.price),
                stock: Number(product.stock),
                image_url: product.image_url
            })
                .then(() => {
                    setMessage('Product updated successfully')
                    setEditingProductId(null)
                    loadProducts()
                })
                .catch((error) => {
                    console.error('Error updating product:', error)
                    setMessage(error.response?.data?.detail || 'Could not update product')
                })
        }
    }

    function deleteProduct(productId) {
        deleteManagerProductApi(productId)
            .then(() => {
                setMessage('Product removed from store')
                loadProducts()
            })
            .catch((error) => {
                console.error('Error deleting product:', error)
                setMessage(error.response?.data?.detail || 'Could not delete product')
            })
    }
    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>MANAGE PRODUCTS</h1>

                <button
                    type="button"
                    className="admin-add-btn"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    + Add Product
                </button>
            </div>

            {showAddForm && (
                <div className="admin-form">
                    <h2>Add New Product</h2>

                    <input type="text" placeholder="Product name" value={newProduct.name}
                        onChange={(event) => updateNewProduct('name', event.target.value)}
                    />

                    <input type="number" placeholder="Price" value={newProduct.price}
                        onChange={(event) => updateNewProduct('price', event.target.value)}
                    />

                    <input type="number" placeholder="Stock" value={newProduct.stock}
                        onChange={(event) => updateNewProduct('stock', event.target.value)}
                    />

                    <input type="file" accept="image/*"
                        onChange={(event) => updateNewProduct('image', event.target.files[0])}
                    />

                    <div className="admin-form-actions">
                        <button type="button" onClick={createProduct}>Save</button>
                        <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {message && <p className="admin-message">{message}</p>}

            <div className="admin-products-grid">
                {products.map((product) => (
                    <div className="admin-product-card" key={product.id}>
                        {editingProductId === product.id ? (
                            <div className="admin-edit-form">
                                {product.image_url && (
                                    <img src={getImageSrc(product.image_url)} alt={product.name} />
                                )}

                                <input
                                    type="text"
                                    value={product.name}
                                    onChange={(event) =>
                                        updateProductField(product.id, 'name', event.target.value)
                                    }
                                />

                                <input
                                    type="number"
                                    value={product.price}
                                    onChange={(event) =>
                                        updateProductField(product.id, 'price', event.target.value)
                                    }
                                />

                                <input
                                    type="number"
                                    value={product.stock}
                                    onChange={(event) =>
                                        updateProductField(product.id, 'stock', event.target.value)
                                    }
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) =>
                                        updateProductField(product.id, 'image', event.target.files[0])
                                    }
                                />

                                <div className="admin-form-actions">
                                    <button type="button" onClick={() => updateProduct(product)}>Save</button>
                                    <button type="button" onClick={() => setEditingProductId(null)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="admin-image-box">
                                    {product.image_url ? (
                                        <img src={getImageSrc(product.image_url)} alt={product.name} />
                                    ) : (
                                        <div className="admin-no-image">No Image</div>
                                    )}
                                </div>

                                <h3>{product.name}</h3>
                                <p className="admin-price">${product.price}</p>
                                <p className="admin-stock">Stock: {product.stock}</p>

                                <div className="admin-actions">
                                    <button
                                        type="button"
                                        title="Update product"
                                        onClick={() => setEditingProductId(product.id)}
                                    >
                                        ✏️
                                    </button>

                                    <button
                                        type="button"
                                        title="Delete product"
                                        onClick={() => deleteProduct(product.id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminProductsPage
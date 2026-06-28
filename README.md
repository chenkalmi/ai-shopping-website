# AI Shopping Website

AI Shopping Website is a full-stack e-commerce platform built with **FastAPI**, **React**, **MySQL**, **Redis** and **OpenAI**.

The project provides complete user authentication, product management, shopping cart, favorites, order management, an AI shopping assistant, and an administrator dashboard.

---

# Overview

The system consists of two main parts:

- **Backend** built with FastAPI and SQLAlchemy
- **Frontend** built with React and Vite

The platform supports:

- User registration and authentication
- JWT authorization
- Product management
- Product search
- Favorites
- Shopping cart
- Orders
- AI shopping assistant
- Administrator panel
- Product image upload
- Soft delete products

---

# Features Implemented

## User Registration

- Create new users
- Email validation
- Username validation
- Password validation
- Password hashing using bcrypt
- Store users in MySQL

---

## Authentication

- Login with username and password
- JWT authentication
- Token validation
- Current authenticated user endpoint
- Swagger authorization
- Logout
- Delete current account
- Admin authorization support

---

## Products

- Create products
- Update products
- Soft delete products
- Retrieve all products
- Retrieve available products only
- Search products
- Product image support
- Product availability tracking

---

## Product Search

Supports searching by:

- Product name
- Maximum price
- Minimum stock
- Multiple filters together

---

## Favorites

- Add favorite
- Remove favorite
- View favorites
- Duplicate prevention
- Authentication required

---

## Shopping Cart

- Temporary cart
- Add products
- Remove products
- Automatic cart creation
- Purchase cart
- Shipping address
- Stock validation
- Automatic total calculation

---

## Orders

- Order history
- Order details
- Closed orders
- Purchased prices
- Product quantities
- Shipping address

---

## Chat Assistant

- OpenAI integration
- Product-aware responses
- Persistent conversations
- Conversation history
- Prompt tracking
- Maximum 5 prompts per user
- Authentication required
---

### Redis Caching

- Redis cache integration
- Cache available products
- Automatic cache invalidation after product updates
- Automatic cache invalidation after product deletion
- Automatic cache invalidation after successful purchases
- Fallback to MySQL when cache is empty
- Automatic cache refresh after cache miss

---

## Administrator Panel

Administrator users can:

- View all products
- Create products
- Update products
- Soft delete products
- Upload product images
- Replace existing images
- View uploaded images immediately

---

## Product Images

Implemented image upload support.

Features:

- Upload images from frontend
- Store images inside backend/uploads
- Save image path inside database
- Display images throughout the website
- Serve uploaded images using FastAPI StaticFiles

Images are displayed in:

- Home page
- Favorites
- Shopping cart
- Order details
- Administrator panel

---

## Soft Delete

Products are never physically removed from the database.

Instead:

- `is_active = False`

This allows:

- Old orders to remain valid
- Favorites to remain consistent
- Historical purchases to keep product information

Removed products:

- Cannot be purchased
- Cannot be added to favorites
- Cannot be added to cart
- Are hidden from the public catalog
- Are marked as unavailable inside existing carts and previous orders

---

# Technologies

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- MySQL
- Redis
- redis-py
- Passlib (bcrypt)
- python-jose
- OAuth2PasswordBearer
- python-dotenv
- python-multipart
- OpenAI SDK

## Frontend

- React
- Vite
- React Router
- Axios
- JavaScript
- CSS

## Database

- MySQL

## DevOps

- Docker
- Docker Compose
---

# Project Structure

backend/

├── app/

│   ├── database/
│   │   ├── connection.py
│   │   └── create_tables.py
│
│   ├── models/
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── favorite.py
│   │   ├── order.py
│   │   ├── order_item.py
│   │   ├── chat_usage.py
│   │   ├── chat_conversation.py
│   │   └── chat_message.py
│
│   ├── routers/
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── favorites.py
│   │   ├── orders.py
│   │   ├── chat.py
│   │   └── manager.py
│
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── product.py
│   │   ├── favorite.py
│   │   ├── order.py
│   │   └── chat.py
│
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── chat_service.py
│   │   ├── redis_service.py
│   │   └── manager_service.py
│
│   └── main.py
│
├── uploads/
│
└── requirements.txt


frontend/

├── src/
│
├── components/
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   └── *.css
│
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── FavoritesPage.jsx
│   ├── CartPage.jsx
│   ├── OrdersPage.jsx
│   ├── ChatPage.jsx
│   └── AdminProductsPage.jsx
│
├── services/
│   ├── authApi.js
│   ├── productsApi.js
│   ├── favoritesApi.js
│   ├── ordersApi.js
│   ├── chatApi.js
│   └── managerApi.js
│
├── App.jsx
│
└── main.jsx

# API Endpoints

## Authentication

POST /auth/register

POST /auth/login

GET /auth/me

POST /auth/logout

DELETE /auth/me

---

## Products

GET /products

GET /products/search

GET /products/available

---

## Favorites

POST /favorites

GET /favorites

DELETE /favorites/{product_id}

---

## Orders

POST /orders/items

GET /orders/temp

DELETE /orders/items/{product_id}

POST /orders/purchase

GET /orders

GET /orders/{order_id}

---

## Chat

GET /chat/conversations

POST /chat/conversations

GET /chat/conversations/{conversation_id}/messages

POST /chat/conversations/{conversation_id}/messages

---

## Manager

GET /manager/products

POST /manager/products

PUT /manager/products/{product_id}

DELETE /manager/products/{product_id}

POST /manager/upload-image

---

# Database

## Users Table

Fields:

- id
- first_name
- last_name
- email
- phone
- country
- city
- username
- password_hash
- is_admin

---

## Products Table

Fields:

- id
- name
- price
- stock
- is_active
- image_url

---

## Favorites Table

Fields:

- id
- user_id
- product_id

---

## Orders Table

Fields:

- id
- user_id
- order_date
- shipping_address
- total_price
- status (TEMP / CLOSED)

---

## Order Items Table

Fields:

- id
- order_id
- product_id
- quantity
- price_at_purchase

---

## Chat Usage Table

Fields:

- id
- user_id
- prompt_count

---

## Chat Conversations Table

Fields:

- id
- user_id
- title

---

## Chat Messages Table

Fields:

- id
- conversation_id
- role
- content

# Development Progress

## Phase 1 – User Management ✅

Implemented:

- Database connection
- Users table
- User registration API
- Login API
- Password hashing
- JWT authentication
- Swagger authorization
- Logout
- Delete account

Completed: June 2026

---

## Phase 2 – Product Management ✅

Implemented:

- Products table
- Product model
- Product schema
- Product creation
- Product retrieval
- Product search
- Product availability endpoint

Completed: June 2026

---

## Phase 3 – Favorites & Authentication ✅

Implemented:

- Favorites table
- Add favorite
- Remove favorite
- View favorites
- Duplicate prevention
- Protected endpoints
- Current authenticated user endpoint

Completed: June 2026

---

## Phase 4 – Orders ✅

Implemented:

- Temporary orders
- Shopping cart
- Add products
- Remove products
- Purchase orders
- Shipping address
- Order history
- Order details
- Stock update after purchase
- Automatic total price calculation
- Automatic removal of empty carts

Completed: June 2026

---

## Phase 5 – AI Assistant ✅

Implemented:

- OpenAI integration
- Product-aware assistant
- Prompt tracking
- Prompt limitation
- Chat endpoint
- Error handling

Completed: June 2026

---

## Phase 6 - Backend Finalization ✅

Implemented:

- User logout endpoint
- Delete current user endpoint
- Delete user related data
- Available products endpoint
- Backend requirements review

Completed: June 2026

---

## Phase 7 - Frontend Foundation ✅

Implemented:

- React project setup using Vite
- Axios API service layer
- React Router setup
- Navigation bar
- Home page
- Product card component
- Display available products from backend
- Product search by name
- Product filtering by maximum price
- Product filtering by minimum stock
- Reset search filters
- Login page
- JWT token storage in localStorage
- Redirect to home page after successful login
- CORS configuration between frontend and backend

Completed: June 2026

---

## Phase 8 - User Features ✅

Implemented:

- User registration page
- Separate Login and Register pages
- Account menu with authentication state
- Logout functionality
- Friendly authentication error messages
- Favorites management
- Add products to cart from Home and Favorites
- Dedicated Shopping Cart page
- Remove products from cart
- Purchase flow with shipping address
- Dedicated Order History page
- View order details
- Display purchased products
- Display shipping address and total price
- AI Shopping Assistant page
- Feature-based frontend API services

Completed: June 2026

---

## Phase 9 - Backend Improvements ✅

Implemented:

- Backend validation improvements
- Better error handling
- Stock validation when adding products to cart
- Stock validation before purchase
- Prevent purchasing unavailable products
- Chat assistant connected to OpenAI backend
- Product-aware AI responses
- Persistent conversations
- Conversation history
- Conversation titles
- Conversation retrieval endpoints
- Conversation message retrieval
- Continue existing conversations
- Prompt usage tracking
- Five prompt limit per user

Completed: June 2026

---

## Phase 10 - Administrator Panel & Product Images ✅

Implemented:

### Administrator

- Admin-only authorization
- Manager router
- Administrator dashboard
- Create products
- Update products
- Soft delete products
- View all products

### Product Images

- Image upload endpoint
- Upload images from frontend
- Store uploaded files inside `backend/uploads`
- Save image path in `image_url`
- FastAPI static image serving
- Display images throughout the application

### Product Availability

- Added `is_active` field to products
- Soft delete implementation
- Removed products remain in database
- Existing orders continue displaying removed products
- Existing favorites continue displaying removed products
- Existing carts continue displaying removed products
- Removed products are marked as unavailable
- Prevent adding removed products to favorites
- Prevent adding removed products to cart
- Prevent purchasing removed products
- Chat assistant ignores removed products

### Frontend Updates

- Administrator page
- Product image preview
- Product image upload
- Product image replacement
- Images displayed on:
- Home page
- Favorites
- Shopping cart
- Order history
- Administrator dashboard

Completed: June 2026

---

### Phase 11 – Redis Integration ✅

Implemented:

- Redis server integration
- Redis service layer
- Cache available products endpoint
- Automatic cache invalidation after product creation
- Automatic cache invalidation after product updates
- Automatic cache invalidation after product removal
- Automatic cache invalidation after purchases
- Automatic cache refresh from MySQL

Completed: June 2026

---

### Phase 12 – Docker Support ✅

Implemented:

- Backend Dockerfile
- Frontend Dockerfile
- Docker Compose setup
- MySQL service container
- Redis service container
- Backend service container
- Frontend service container
- Environment configuration for Docker
- Verified project runs with Docker Compose

Completed: June 2026

---

### Phase 13 – Frontend UI & Chat Experience ✅

Implemented:

### UI Improvements

- Redesigned homepage
- Redesigned navigation bar
- Improved product cards
- Modern shopping cart layout
- Redesigned favorites page
- Improved login and registration pages
- Improved orders page
- Redesigned administrator dashboard
- Consistent styling across the application

### AI Assistant UI

- Modern chat interface
- Chat drawer in navigation bar
- Conversation history drawer
- Start new conversation
- Conversation history integration
- Chat layout similar to modern AI assistants

Completed: June 2026

---


# Bonus

Planned:

- Machine Learning recommendation model
- Product prediction API
- Model training pipeline
- Dataset documentation
- Frontend integration for recommendations

---
# AI Shopping Website

AI shopping website built with FastAPI, MySQL and ChatGPT integration.

## Overview

AI Shopping Website is a full-stack shopping platform currently under development.

The project is built with FastAPI, MySQL and SQLAlchemy and is designed to support user management, product management and AI-based shopping recommendations.

---

## Features Implemented

### User Registration

- Create new user accounts
- Email validation
- Password length validation
- Unique username validation
- Unique email validation
- Password hashing using bcrypt
- Store users in MySQL database

### User Login and Authentication

- Login using username and password
- Verify password against stored hash
- Return JWT access token after successful login
- Return error response for invalid credentials
- Token expiration support
- Decode and validate JWT tokens
- Protected routes using authentication
- Retrieve current authenticated user
- Swagger authorization support

### Product Management

- Create new products
- Store products in MySQL database
- Retrieve all products

### Product Search

- Search products by name
- Multi-word search support
- Search by price (<, >, =)
- Search by stock (<, >, =)
- Combine multiple filters
- Return error when no products are found

### Favorites System

- Add products to favorites
- Remove products from favorites
- View favorite products
- Prevent duplicate favorites
- Favorites persist in database
- Favorites available only for authenticated users

### Orders Management

- Create temporary orders automatically
- Add products to temporary orders
- Prevent ordering more items than available stock
- View current temporary order
- Remove products from temporary order
- Automatically delete empty temporary orders
- Purchase orders
- Update product stock after purchase
- Save shipping address
- Calculate total order price
- Convert temporary orders to closed orders
- View order history
- View order details
- Orders persist in database
- Orders available only for authenticated users

### Chat Assistant

- ChatGPT-powered shopping assistant
- Authenticated users only
- Product-aware responses
- Available and out-of-stock product awareness
- Prompt usage tracking
- Maximum 5 prompts per user
- OpenAI API integration
---

## Technologies

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- MySQL
- Passlib (bcrypt)
- python-jose (JWT)
- OAuth2PasswordBearer
- python-multipart
- OpenAI API
- OpenAI Python SDK
- python-dotenv

### Database

- MySQL

---

## Project Structure

backend/
├── app/
│   ├── database/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   └── main.py

frontend/

ml_model/

---

## API Endpoints

### Authentication

POST /auth/register

POST /auth/login

GET /auth/me

### Products

POST /products

GET /products

GET /products/search

### Favorites

POST /favorites

GET /favorites

DELETE /favorites/{product_id}

### Orders

POST /orders/items

GET /orders/temp

DELETE /orders/items/{product_id}

POST /orders/purchase

GET /orders

GET /orders/{order_id}

### Chat

POST /chat

---

## Database

### Users Table

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

### Products Table

Fields:

- id
- name
- price
- stock

### Favorites Table

Fields:

- id
- user_id
- product_id

### Orders Table

Fields:

- id
- user_id
- order_date
- shipping_address
- total_price
- status (TEMP / CLOSED)

### Order Items Table

Fields:

- id
- order_id
- product_id
- quantity
- price_at_purchase

---

## Development Progress

### Phase 1 - User Management ✅

Implemented:

- Database connection
- Users table
- User registration API
- User login API
- Password hashing with bcrypt
- Swagger testing

Completed: June 2026

---

### Phase 2 - Product Management ✅

Implemented:

- Products table
- Product model
- Product schema
- Product creation API
- Product listing API
- Product search API
- Search by name
- Search by price
- Search by stock
- Multi-word search support

Completed: June 2026

---

### Phase 3 - Authentication & Favorites ✅

Implemented:

- JWT access token creation
- Token expiration
- JWT decoding and validation
- Current user authentication
- Protected route example with /auth/me
- Swagger authorization integration
- OAuth2 password form login support
- Favorites table
- Add favorite
- Remove favorite
- View favorites
- Duplicate favorite prevention

Completed: June 2026

Next Step:

- Shopping cart

---

### Phase 4 - Orders Management ✅

Implemented:

- Orders table
- Order items table
- Temporary order creation
- Add products to temporary orders
- Remove products from temporary orders
- View temporary order
- Purchase order
- Shipping address support
- Stock validation
- Stock update after purchase
- Automatic total price calculation
- Order history
- Order details
- Automatic deletion of empty temporary orders
- Closed and temporary order status support

Completed: June 2026

Next Step:

- AI recommendation engine

### Phase 5 - Chat Assistant ✅

Implemented:

- OpenAI integration
- Chat request schema
- Chat service
- Product context generation
- Prompt usage tracking
- 5 prompts limit per user
- Chat endpoint
- Error handling

Completed: June 2026

Next Step:

- Frontend integration
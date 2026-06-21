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

Next Step:

- Product model
- Product APIs

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

Next Step:

- JWT Authentication

---

### Phase 3 - JWT Authentication ✅

Implemented:

- JWT access token creation
- Token expiration
- JWT decoding and validation
- Current user authentication
- Protected route example with /auth/me
- Swagger authorization integration
- OAuth2 password form login support

Completed: June 2026

Next Step:

- Favorites system

---

## Planned Features

- Favorites system
- Shopping cart
- Orders management
- AI recommendation engine
- Frontend integration
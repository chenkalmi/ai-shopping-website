# AI_SHOPPING_WEBSITE
AI shopping website with FastAPI and ChatGPT

# AI Shopping Website

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

### User Login

- Login using username and password
- Verify password against stored hash
- Return success response for valid credentials
- Return error response for invalid credentials

---

## Technologies

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- MySQL
- Passlib (bcrypt)

---

## Project Structure

backend/
├── app/
│ ├── database/
│ ├── models/
│ ├── routers/
│ ├── schemas/
│ ├── services/
│ └── main.py

frontend/

ml_model/

---

## API Endpoints

### Authentication

POST /auth/register

POST /auth/login

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

---

## Current Status

Completed:

- Database connection
- Users table
- Registration API
- Login API
- Password hashing
- Swagger testing

Next Steps:

- JWT Authentication
- Product model
- Product APIs
- Shopping cart
- AI recommendation engine
# Amber & Crust - Artisan Bakery Ordering System

A premium, full-stack Bakery Ordering System built with a **Next.js 15** frontend and a **Node.js / Express.js / MongoDB** backend API.

---

## Features

- 🏪 **Gourmet Home Page** with hero banner, category filters, and patron reviews.
- 🥐 **Interactive Menu / Catalog Page** with active search and price slider selectors.
- 📖 **Details View** with ingredients lists and quantity controls.
- 🛒 **Persistent Shopping Cart** cached via local storage.
- 💳 **Simulated Credit Card Checkout** form with instant backend inventory deduction.
- 👤 **Customer Profile** settings and order history tracking.
- 🛡️ **Admin Dashboard** with product CRUD (add, update, delete) and order preparation tracking.
- 🗝️ **JWT Authentication** for secure routing.

---

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Lucide Icons, React 19.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose, JWT (jsonwebtoken), BcryptJS.
- **Database**: MongoDB (Mongoose schemas).

---

## Getting Started

### 1. Prerequisites

You must install:
- **Node.js** (v18.0.0 or higher): [Download Node.js](https://nodejs.org/)
- **MongoDB Community Server**: [Download MongoDB](https://www.mongodb.com/try/download/community)

Ensure that your local MongoDB database is running on the default port: `mongodb://localhost:27017`

---

### 2. Run the Express Backend Server

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the backend developer environment:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`. Upon launching for the first time, it will automatically connect to MongoDB and seed default products and user accounts.*

---

### 3. Run the Next.js Frontend Client

1. Open a separate terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js client development server:
   ```bash
   npm run dev
   ```
4. Open your web browser to `http://localhost:3000` to interact with the application.

---

## Default Seeded Accounts

The database seeder automatically creates two demo profiles. You can use them to log in immediately:

### 👤 Customer Profile
- **Email**: `user@bakery.com`
- **Password**: `user123`

### 🛡️ Admin Profile
- **Email**: `admin@bakery.com`
- **Password**: `admin123`

---

## Project Folder Structure

```
bakery/
├── client/                     # Next.js 15 Frontend
│   ├── public/images/          # Product and Hero images
│   ├── src/
│   │   ├── app/                # App Router Layouts and Pages
│   │   ├── components/         # Reusable Navbar and Footer
│   │   └── context/            # AuthContext and CartContext state providers
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── server/                     # Express Backend Server
│   ├── src/
│   │   ├── config/db.ts        # Database connection configuration
│   │   ├── middleware/auth.ts  # JWT Authentication & Admin middleware
│   │   ├── models/             # Mongoose Schemas (User, Product, Order)
│   │   ├── routes/             # Express Route handlers
│   │   └── index.ts            # Entrypoint with seed database routines
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                   # Setup instruction manual
```

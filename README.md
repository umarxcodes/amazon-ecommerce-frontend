# Amazon-Style Ecommerce Frontend

[![React](https://img.shields.io/badge/React-19.x-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646cff)](https://vite.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764abc)](https://redux-toolkit.js.org/)
[![React Router](https://img.shields.io/badge/React_Router-7.x-ca4245)](https://reactrouter.com/)
[![Stripe Checkout](https://img.shields.io/badge/Stripe-Checkout-635bff)](https://stripe.com/)

An Amazon-inspired ecommerce frontend built with React, Vite, Redux Toolkit, and Axios. It delivers a full storefront experience on top of the backend API: homepage merchandising, product discovery, cart management, checkout, Stripe payment return handling, order tracking, account tools, and admin dashboards.

The app is designed to feel close to a real marketplace UI while still keeping the codebase clean, modular, and easy to extend.

## Live Demo

- Frontend: https://amazon-ecommerce-frontend.vercel.app
- Backend API: https://amazon-ecommerce-backend.vercel.app/api
- Local dev server: `http://localhost:5173`

## Features

### Storefront Experience

- Amazon-style homepage with hero carousel, category cards, horizontal product shelves, and full catalog sections
- Category-driven merchandising powered directly by backend product data
- Dedicated image gallery shelf that renders every available product image from the API
- Responsive layout for desktop and mobile browsing

### Product Discovery

- Search products by keyword
- Filter by category, price range, and rating
- Sort by featured, price ascending, price descending, or review score
- URL-driven filters so catalog state is shareable and refresh-safe
- Dedicated gaming page with themed filtering and pagination

### Product Detail Experience

- Product image gallery with multiple backend images
- Detailed product info, tabs, ratings, and related products
- Add-to-cart flow with auth checks and toast feedback
- Preserved back-navigation to the user's previous filtered catalog view

### Authentication

- User registration and login
- Persistent session restore from local storage
- Global JWT attachment through Axios interceptors
- Automatic logout and redirect when the backend returns `401`

### Cart, Checkout, and Orders

- Local cart persistence for better UX
- Backend-synced cart for authenticated users
- Quantity updates, remove item, and clear cart actions
- Shipping form with client-side validation
- Order creation followed by Stripe Checkout redirect
- Stripe payment return page with payment confirmation and retry handling
- Order history and order detail pages with status and payment visibility

### Admin Tools

- Admin-only product management
- Add, edit, and delete products
- Multipart image uploads for product creation and updates
- Category-safe product forms using the supported backend category list
- Admin-only user management with role updates, activation/deactivation, and admin creation

### UI and Developer Experience

- Redux Toolkit slices for predictable state management
- Reusable layout and shared components
- Loading spinners, skeleton cards, empty states, confirmation modals, and toast notifications
- Clean feature-based folder structure for scaling the app

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | React 19 |
| Build Tool | Vite 7 |
| Routing | React Router 7 |
| State Management | Redux Toolkit + React Redux |
| HTTP Client | Axios |
| Forms | React Hook Form + Yup |
| Styling | Plain CSS modules/files by feature/page |
| Icons | Font Awesome |
| Payments | Stripe Checkout |
| Deployment | Vercel |

## Frontend Architecture

```text
Browser
  |
  v
React + React Router
  |
  v
Layout / Pages / Feature Components
  |
  v
Redux Store
  |- auth
  |- cart
  |- products
  |- orders
  |- admin
  |- ui
  |
  v
Axios Instance
  |
  v
Backend API + Stripe Checkout
```

## Project Structure

```text
amazon-ecommerce-frontend/
├── public/                         # Static assets
├── src/
│   ├── app/                        # Redux store and slice helpers
│   ├── components/
│   │   ├── layout/                 # Header, footer, layout-level UI
│   │   └── shared/                 # Buttons, loaders, empty states, modals
│   ├── constants/                  # Shared constants such as product categories
│   ├── features/
│   │   ├── admin/                  # Admin users state, APIs, schemas
│   │   ├── auth/                   # Login/register/session logic
│   │   ├── cart/                   # Cart state and checkout session helpers
│   │   ├── orders/                 # Order CRUD and payment confirmation flow
│   │   ├── products/               # Catalog/product state and UI
│   │   └── ui/                     # Toasts and UI state
│   ├── hooks/                      # Typed/custom hooks wrapping store logic
│   ├── layout/                     # Shared page shell
│   ├── pages/                      # Route-level pages
│   ├── routes/                     # AppRoutes and route guards
│   ├── services/                   # Axios client
│   ├── utils/                      # Helpers and normalizers
│   ├── App.jsx                     # App shell
│   └── main.jsx                    # React entry point
├── .env.local                      # Local frontend environment variables
├── package.json
└── vite.config.js
```

## Route Map

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Amazon-style homepage powered by backend products |
| `/products` | Public | Main catalog with search, filters, sort, and pagination |
| `/products/:productId` | Public | Product detail page |
| `/gaming` | Public | Gaming storefront |
| `/login` | Public | User sign-in |
| `/register` | Public | User registration |
| `/account` | Protected | Account dashboard |
| `/cart` | Protected | Shopping cart |
| `/checkout` | Protected | Shipping form and order placement |
| `/orders` | Protected | User order history |
| `/orders/:orderId` | Protected | Order detail and payment retry |
| `/payment/return/:orderId` | Protected | Stripe payment return handler |
| `/admin/products` | Admin | Product management |
| `/admin/products/add` | Admin | Product creation flow |
| `/admin/users` | Admin | User management |

## State Management

| Slice | Responsibility |
| --- | --- |
| `auth` | Login, registration, session restore, logout |
| `cart` | Cart items, shipping address, checkout session state |
| `products` | Catalog data, selected product, filters, product mutations |
| `orders` | Order lists, order detail, Stripe checkout and confirmation |
| `admin` | User administration and admin-only mutations |
| `ui` | Toasts and small UI interactions |

## API Integration

The frontend talks to the backend through a single Axios client in `src/services/axiosInstance.js`.

Key behavior:

- Uses `VITE_API_URL` as the API base URL
- Falls back to the deployed backend if no local env value is present
- Attaches the JWT token from Redux on authenticated requests
- Clears the session and redirects to `/login` on `401`
- Supports product catalog, auth, cart, orders, admin, and Stripe payment confirmation endpoints

## Getting Started

### Prerequisites

| Requirement | Version |
| --- | --- |
| Node.js | 18+ |
| Yarn or npm | Latest |
| Backend API | Running locally or deployed |

### 1. Clone the Repository

```bash
git clone <your-frontend-repository-url>
cd amazon-ecommerce-frontend
```

### 2. Install Dependencies

```bash
# With yarn
yarn install

# Or with npm
npm install
```

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
VITE_API_URL=http://localhost:5000/api
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
```

If you want to use the deployed backend during local frontend development:

```env
VITE_API_URL=https://amazon-ecommerce-backend.vercel.app/api
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
```

### 4. Start the Development Server

```bash
yarn dev
```

Then open `http://localhost:5173`.

## Environment Variables

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `VITE_API_URL` | Yes | Backend API base URL | `http://localhost:5000/api` |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key used by the checkout flow | `pk_test_xxxxx` |

## Available Scripts

```bash
yarn dev       # Start local Vite dev server
yarn build     # Create production build
yarn preview   # Preview production build locally
yarn lint      # Run ESLint
```

## Core User Flows

### Customer Flow

1. Browse products from the homepage or catalog
2. Open a product detail page and add items to cart
3. Review cart and continue to checkout
4. Enter shipping address and place the order
5. Redirect to Stripe Checkout
6. Return to the payment result page and confirm the order status
7. Review the order later from the orders dashboard

### Admin Flow

1. Sign in with an admin account
2. Open the account page and enter the admin dashboard
3. Manage products with image uploads and category validation
4. Manage users, create admins, and update account roles/status

## Deployment Notes

- The frontend is ready for deployment on Vercel
- Set `VITE_API_URL` to your production backend API URL in Vercel project settings
- Set `STRIPE_PUBLISHABLE_KEY` to your production or test Stripe publishable key
- Make sure the backend CORS allow-list includes both:
  - your deployed frontend URL
  - `http://localhost:5173` for local development

## Companion Backend

This frontend expects a backend that provides:

- Authentication endpoints
- Product catalog endpoints
- Cart endpoints
- Order endpoints
- Admin endpoints
- Stripe checkout and payment confirmation endpoints

In this workspace, that service is the `amazon-ecommerce-backend` project.

## Why This Frontend Is Structured Well

- Feature-based organization keeps business logic close to UI concerns
- Redux slices isolate async flows cleanly
- Route-level pages stay focused and readable
- Shared components reduce duplication across storefront and admin areas
- URL-based filtering improves UX and makes catalog views shareable
- The payment return flow is separated from order detail for clearer Stripe handling

## Production Checklist

- Configure `VITE_API_URL`
- Configure `STRIPE_PUBLISHABLE_KEY`
- Verify backend CORS for local and deployed frontend origins
- Verify Stripe checkout success and cancel URLs
- Run `yarn lint`
- Run `yarn build`

## Summary

This project is a complete ecommerce frontend, not just a product grid. It includes storefront merchandising, search and filtering, authenticated shopping, order management, Stripe payment handling, and admin dashboards in a single React application that is ready to connect to the backend and deploy.


# 📈 Stock Trading Platform

A full-stack stock trading web application inspired by modern online trading platforms. This project provides a public-facing landing website, user authentication, and a protected trading dashboard for viewing holdings, positions, orders, funds, watchlists, and related market information.

> ⚠️ **Note:** This is an educational/demo project and is not connected to a real stock exchange or real-money brokerage service.

---
## 🚀 Live Demo

👉 **[Live Website](https://stock-trading-platform-frontend-api.netlify.app/)**

---
## 🚀 Project Overview

The **Stock Trading Platform** is a full-stack web application built to simulate the experience of a modern online stock trading platform.

The project is divided into three independent applications:

- 🌐 **Frontend** — Public website, landing pages, login, and signup
- ⚙️ **Backend** — Express.js REST API, authentication, MongoDB integration, and trading-related APIs
- 📊 **Dashboard** — Protected React trading dashboard available after authentication

### Main Application Flow

```text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Frontend :3000      │
                  │ Landing / Login     │
                  │ / Signup            │
                  └─────────┬───────────┘
                            │
                            │ API Requests
                            ▼
                  ┌─────────────────────┐
                  │ Backend :3002       │
                  │ Node + Express      │
                  │ Authentication      │
                  └─────────┬───────────┘
                            │
                            ▼
                  ┌─────────────────────┐
                  │ MongoDB             │
                  │ Users / Orders      │
                  │ Holdings / Positions│
                  └─────────┬───────────┘
                            ▲
                            │
                            │ Authenticated API
                            │
                  ┌─────────┴───────────┐
                  │ Dashboard :3001     │
                  │ Trading Interface   │
                  └─────────────────────┘
```

---

# ✨ Features

## 🌐 Public Frontend

- Responsive landing page
- Home page
- About page
- Products page
- Pricing page
- Support page
- Navigation bar
- Footer
- Login page
- Signup page
- User registration
- User login
- Redirect to dashboard after successful authentication

---

## 🔐 Authentication

- User signup
- User login
- Secure password hashing using Node.js `crypto`
- Password verification
- HTTP-only authentication cookie
- Authenticated user sessions
- `/auth/me` endpoint
- Logout functionality
- Protected dashboard routes
- Authentication guard

---

## 📊 Trading Dashboard

- Dashboard/Home view
- Watchlist
- Holdings
- Positions
- Orders
- Funds
- Buy/Sell action window
- Charts and graphical data
- User profile
- Authenticated dashboard access

---

## 💾 Backend

- REST API using Express.js
- MongoDB database
- Mongoose models
- User authentication
- Authentication middleware
- Password security
- Holdings management
- Orders management
- Positions management
- CORS configuration
- Environment variable support

---

# 🗂️ Project Structure

```text
stock-trading-platform/
│
├── .gitignore
├── README.md
│
├── backend/
│   ├── model/
│   │   ├── HoldingsModel.js
│   │   ├── OrdersModel.js
│   │   ├── PositionsModel.js
│   │   └── UserModel.js
│   │
│   ├── schemas/
│   │   ├── HoldingsSchema.js
│   │   ├── OrdersSchema.js
│   │   ├── PositionsSchema.js
│   │   └── UserSchema.js
│   │
│   ├── .env.example
│   ├── auth.js
│   ├── auth.test.js
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── dashboard/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Apps.js
│   │   │   ├── AuthGuard.js
│   │   │   ├── BuyActionWindow.js
│   │   │   ├── Dashboard.js
│   │   │   ├── DoughnoutChart.js
│   │   │   ├── Funds.js
│   │   │   ├── GeneralContext.js
│   │   │   ├── Holdings.js
│   │   │   ├── Home.js
│   │   │   ├── Menu.js
│   │   │   ├── Orders.js
│   │   │   ├── Positions.js
│   │   │   ├── Summary.js
│   │   │   ├── TopBar.js
│   │   │   ├── VerticalGraph.js
│   │   │   └── WatchList.js
│   │   │
│   │   ├── data/
│   │   │   └── data.js
│   │   │
│   │   ├── index.css
│   │   └── index.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── public/
    │   └── Media/
    │       └── images/
    │
    ├── src/
    │   ├── landing_page/
    │   │   ├── about/
    │   │   ├── home/
    │   │   ├── pricing/
    │   │   ├── products/
    │   │   ├── signup/
    │   │   ├── support/
    │   │   ├── Footer.js
    │   │   ├── Navbar.js
    │   │   ├── NotFound.js
    │   │   └── OpenAccount.js
    │   │
    │   ├── auth.js
    │   ├── index.css
    │   └── index.js
    │
    ├── .env.example
    ├── package.json
    └── package-lock.json
```

---

# 🛠️ Technologies Used

## Frontend

- **React.js** — Component-based UI development
- **React Router** — Client-side routing
- **Axios** — API communication
- **CSS** — Styling and responsive layouts
- **Create React App** — Development and build tooling

## Dashboard

- **React.js**
- **React Router**
- **Axios**
- **CSS**
- React Context
- Reusable React components
- Chart components

## Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Axios**
- **CORS**
- **Environment Variables**
- **Node.js Crypto APIs**

## Development Tools

- Git
- GitHub
- Visual Studio Code
- npm
- MongoDB Atlas / MongoDB

---

# 🔐 Authentication Architecture

The application uses **cookie-based authentication**.

## Signup Flow

```text
Frontend
   │
   │ POST /auth/signup
   ▼
Express Backend
   │
   ├── Validate user input
   │
   ├── Hash password
   │
   ├── Create user in MongoDB
   │
   └── Set authentication cookie
```

## Login Flow

```text
Frontend
   │
   │ POST /auth/login
   ▼
Backend
   │
   ├── Find user
   │
   ├── Verify password
   │
   └── Set authentication cookie
```

## Authenticated Requests

The dashboard sends requests with credentials:

```javascript
{
  withCredentials: true
}
```

The backend verifies the authentication cookie before allowing access to protected resources.

---

# 🔌 API Endpoints

## Authentication APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | Create a new user account |
| `POST` | `/auth/login` | Login an existing user |
| `GET` | `/auth/me` | Get currently authenticated user |
| `POST` | `/auth/logout` | Logout the current user |

## Trading/Data APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/allHoldings` | Retrieve holdings |
| `GET` | `/allPositions` | Retrieve positions |
| `POST` | `/newOrder` | Create a new order |

> 🔒 Protected endpoints require an authenticated session.

---

# ⚙️ Environment Variables

Sensitive information should **never be committed to GitHub**.

The actual `.env` files are excluded using `.gitignore`.

## Backend

Create:

```text
backend/.env
```

Example:

```env
MONGO_URL=your_mongodb_connection_string
AUTH_SECRET=your_long_random_secret
PORT=3002
```

> Never publish your real MongoDB connection string or `AUTH_SECRET`.

---

## Dashboard

Create:

```text
dashboard/.env
```

Example:

```env
REACT_APP_API_URL=http://localhost:3002
REACT_APP_LOGIN_URL=http://localhost:3000/login
```

---

## Frontend

If environment variables are required, create:

```text
frontend/.env
```

Refer to:

```text
frontend/.env.example
```

for the required configuration.

---

# 💻 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/akshaya988/stock-trading-platform.git
```

```bash
cd stock-trading-platform
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 4. Install Dashboard Dependencies

```bash
cd ../dashboard
npm install
```

---

## 5. Configure Environment Variables

Create the required `.env` files using the corresponding `.env.example` files.

Example:

```text
backend/.env
dashboard/.env
frontend/.env
```

Do not commit these files to GitHub.

---

# ▶️ Running the Project

The project contains three applications, so run them in **three separate terminals**.

---

## Terminal 1 — Backend

```bash
cd backend
node index.js
```

Backend:

```text
http://localhost:3002
```

---

## Terminal 2 — Frontend

```bash
cd frontend
npm start
```

Frontend:

```text
http://localhost:3000
```

---

## Terminal 3 — Dashboard

```bash
cd dashboard
npm start
```

Dashboard:

```text
http://localhost:3001
```

---

# 🔄 Complete Application Flow

```text
                         USER
                           │
                           ▼
              ┌────────────────────────┐
              │      FRONTEND           │
              │      Port: 3000         │
              │                         │
              │  • Landing Page         │
              │  • Login                │
              │  • Signup               │
              │  • Products             │
              │  • Pricing              │
              │  • Support              │
              └────────────┬───────────┘
                           │
                           │ HTTP Requests
                           ▼
              ┌────────────────────────┐
              │       BACKEND          │
              │       Port: 3002       │
              │                        │
              │  • Express API         │
              │  • Authentication      │
              │  • REST APIs           │
              │  • Middleware          │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │        MONGODB         │
              │                        │
              │  • Users               │
              │  • Orders              │
              │  • Holdings            │
              │  • Positions           │
              └────────────────────────┘
                           ▲
                           │
                           │ Authenticated API
                           │
              ┌────────────┴───────────┐
              │       DASHBOARD        │
              │       Port: 3001       │
              │                        │
              │  • Watchlist           │
              │  • Holdings            │
              │  • Positions           │
              │  • Orders              │
              │  • Funds               │
              │  • Charts              │
              │  • Buy/Sell            │
              └────────────────────────┘
```

---

# 📁 Folder Responsibilities

## `backend/`

Responsible for:

- REST APIs
- Database connection
- MongoDB models
- Authentication
- Password security
- Session/token handling
- Authentication middleware
- Protected routes
- Orders
- Holdings
- Positions

---

## `frontend/`

Responsible for the public-facing website:

- Landing page
- Navigation
- Home
- About
- Products
- Pricing
- Support
- Login
- Signup
- Account opening flow

---

## `dashboard/`

Responsible for the authenticated trading experience:

- Trading dashboard
- Watchlist
- Holdings
- Positions
- Orders
- Funds
- Charts
- Buy/Sell interface
- User profile
- Authentication guard

---

# 🧪 Testing

The project contains authentication and frontend component tests.

Run frontend tests:

```bash
cd frontend
npm test
```

Backend authentication tests are available in:

```text
backend/auth.test.js
```

---

# 🧹 Git & Environment Security

The repository intentionally excludes:

```text
node_modules/
.env
build/
```

This prevents:

- Large dependency folders
- Database credentials
- Authentication secrets
- Local environment configuration
- Generated build files

from being committed to GitHub.

Example environment files are included:

```text
backend/.env.example
dashboard/.env.example
frontend/.env.example
```

These files should contain **placeholders only** and never real credentials.

---

# 🚧 Future Improvements

Planned or possible improvements include:

- 📈 Real-time stock price integration
- 📊 Live market data
- 📉 Advanced stock charts
- 🔎 Stock search and filtering
- 💰 Portfolio performance analytics
- 🧾 Complete order history
- 🔔 Notifications
- 📧 Email verification
- 🔑 Password reset
- 🛡️ Two-factor authentication
- 👤 Role-based authentication
- ☁️ Production deployment
- ⚙️ Automated CI/CD
- 🧪 Comprehensive unit testing
- 🧪 Integration testing
- 📱 Improved mobile responsiveness

---

# 🎯 Learning Outcomes

This project demonstrates practical experience with:

- Full-stack web development
- React application architecture
- REST API development
- Express.js
- Node.js
- MongoDB
- Mongoose
- Authentication and authorization
- Password security
- HTTP cookies
- Protected routes
- API integration
- React Context
- Git and GitHub
- Environment variable management
- Component-based UI development

---

# 👩‍💻 Author

## Akshaya Naidu

GitHub:  
https://github.com/akshaya988

---

# ⚠️ Disclaimer

This project is created for **educational and portfolio purposes**.

It is not an actual brokerage platform and is not connected to a real stock exchange. It should not be used for real financial transactions or investment decisions.

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub!

---

**Built with ❤️ using React, Node.js, Express.js and MongoDB.**
```

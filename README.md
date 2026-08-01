# 📈 Stock Trading Platform

A full-stack modern stock trading & portfolio management platform inspired by leading fintech solutions like Zerodha. Built with React.js, Node.js, Express.js, and MongoDB.

Created & maintained by [sowmyaa88](https://github.com/sowmyaa88).

---

## 🚀 Features

- **Marketing Landing Page (`frontend`)**:
  - Interactive hero section, product showcase, pricing tiers, and about page.
  - User signup & account onboarding UI.
  - Fully responsive navigation and custom branded footer.

- **Trading Dashboard (`dashboard`)**:
  - Real-time stock watchlist with dynamic search & stock items.
  - Detailed portfolio summary showing total investment, P&L, and returns.
  - Holdings and Positions tracker with visual interactive charts (`Chart.js` & `@mui/material`).
  - Buy/Sell stock order placement window.
  - Real-time market indices indicator (NIFTY 50, SENSEX).

- **Backend API (`backend`)**:
  - RESTful API endpoints for fetching holdings, positions, and saving new stock orders.
  - MongoDB models for Holdings, Positions, and Orders using Mongoose schemas.
  - Modular environment configuration (`dotenv`) and CORS support.

---

## 🛠️ Tech Stack

- **Frontend & Dashboard**: React.js, React Router, Material UI (`@mui/material`), Chart.js, Axios, Bootstrap.
- **Backend**: Node.js, Express.js, Mongoose, Passport.js.
- **Database**: MongoDB / MongoDB Atlas.

---

## 📁 Repository Structure

```
stock-trading-platform/
├── frontend/          # Public landing & marketing application (React)
├── dashboard/         # Interactive stock trading dashboard (React)
├── backend/           # REST API server & database models (Express + Node)
├── README.md          # Project documentation
└── .gitignore         # Git ignore configuration
```

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas connection string or local MongoDB instance

### 1. Clone the Repository
```bash
git clone https://github.com/sowmyaa88/stock-trading-platform.git
cd stock-trading-platform
```

### 2. Configure Backend Database
Navigate to the `backend` directory and set up your `.env` file:
```bash
cd backend
cp .env.example .env
```
Update the `MONGO_URL` in `.env` with your MongoDB connection URI:
```env
PORT=3002
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/stock-trading-platform?retryWrites=true&w=majority
```

### 3. Run Backend API Server
```bash
npm install
npm start
```
The backend server runs on `http://localhost:3002`.

### 4. Run Trading Dashboard
In a new terminal tab:
```bash
cd dashboard
npm install
npm start
```
The dashboard runs on `http://localhost:3000` or `http://localhost:3001`.

### 5. Run Public Landing Page
In a new terminal tab:
```bash
cd frontend
npm install
npm start
```

---

## 🛰️ API Endpoints

| Method | Endpoint        | Description                              |
|--------|-----------------|------------------------------------------|
| `GET`  | `/allHoldings`  | Returns user's stock holdings portfolio  |
| `GET`  | `/allPositions` | Returns active open positions            |
| `POST` | `/newOrder`     | Submits a new stock buy/sell order       |

---

## 📜 License

This project is open-source under the [ISC License](LICENSE).

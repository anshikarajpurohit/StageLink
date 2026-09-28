# 🎭 StageLink — Where Theatre Comes Together

**StageLink** is a full-stack community platform connecting theatre artists, directors, theatre troupes, and audiences. Discover local productions, apply for auditions and casting calls, showcase creative portfolios, and celebrate live stage art.

---

## ✨ Features

- **🎭 Recruitment Board & Casting Calls**: Post and apply for auditions, crew positions, and stage roles with detailed requirements.
- **🎟️ Event Listings & Show Discovery**: Explore upcoming plays, theatre festivals, dates, venues, and ticket details.
- **🌟 Artist & Troupe Profiles**: Dedicated portfolios for actors, directors, technicians, and theatre companies.
- **📰 Feed & Community Dashboard**: Stay updated with the latest auditions, shows, and theatre community news.
- **🔐 Authentication & Security**: Secure user signup, login, and authorization powered by JWT and bcrypt.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with **Vite**
- **Tailwind CSS** (Custom theatre aesthetic with dark mode and vintage stage palettes)
- **React Router v7**
- **Axios**

### Backend
- **Node.js** & **Express**
- **MongoDB** with **Mongoose**
- **JSON Web Tokens (JWT)** & **bcryptjs**
- **CORS** & **Dotenv**

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance

### 1. Clone the Repository
```bash
git clone https://github.com/<YOUR-USERNAME>/Stage_Link.git
cd Stage_Link
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:
```bash
npm start
# or with nodemon:
npm run dev
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

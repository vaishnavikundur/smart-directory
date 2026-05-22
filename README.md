# Contact Manager Pro

A modern, high-performance Contact Management application built with the **MERN Stack** (MongoDB, Express, React, Node.js) and TypeScript.

This project features a premium SaaS-style UI with an optimized backend, robust authentication, and a custom high-speed search index for managing thousands of contacts seamlessly.

---

## 🚀 Features

- **Advanced Authentication:** Secure JWT-based auth with access/refresh tokens, optimized bcrypt password hashing, and auto-login flows.
- **Full Contact Management (CRUD):** Create, read, update, and delete contacts with ease.
- **Contact Profile Photos:** Upload, preview, and store profile photos (supports `.jpg`, `.png`, `.webp`) using Base64 encoding.
- **High-Speed Search:** Custom-built backend search engine using a Trie data structure and Inverted Index for lightning-fast autocomplete and fuzzy search.
- **Import & Export:** Easily import contacts from CSV/JSON, and export your address book.
- **Premium UI/UX:** Responsive, Apple-inspired design utilizing **TailwindCSS**, **Framer Motion** for micro-animations, and **Lucide React** for beautiful iconography.
- **Form Validation:** End-to-end type safety and validation using **Zod** and **React Hook Form**.
- **Dark/Light Mode:** Full theming support tied to user preferences.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **State Management:** Zustand (UI & Auth state) + TanStack React Query (Server state)
- **Styling:** TailwindCSS + Vanilla CSS variables
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

### Backend
- **Framework:** Node.js with Express
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose ORM)
- **Validation:** Zod
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **Caching/Search:** Custom in-memory Search Index (Trie + Inverted Index) & Redis-ready patterns

---

## 💻 Getting Started

Follow these steps to get the project running locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- Git

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd "mobile app"
```

### 2. Backend Setup

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
```

**Install Dependencies:**
```bash
npm install
```

**Environment Variables:**
Create a `.env` file in the `backend` directory and add the following:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/contact_manager
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Run the Backend Development Server:**
```bash
npm run dev
```
The backend should now be running on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
```

**Install Dependencies:**
```bash
npm install
```

**Environment Variables:**
Create a `.env` file in the `frontend` directory and add the following:

```env
VITE_API_URL=http://localhost:5000/api
```

**Run the Frontend Development Server:**
```bash
npm run dev
```
The frontend should now be running on `http://localhost:5173`.

---

## 📦 Build for Production

To build the project for production environments:

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```
This will output static files to the `dist` directory which can be served via Nginx, Vercel, Netlify, or your preferred static host.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check out the issues page if you want to contribute.

## 📝 License

This project is licensed under the MIT License.

# SMART DIRECTORY

A modern, high-performance Contact Management application built with the **MERN Stack** (MongoDB, Express, React, Node.js) and TypeScript.

This project features a premium, **Resend-inspired strict dark mode UI**, an optimized backend, robust authentication, and a custom high-speed search index for managing thousands of contacts seamlessly.

---

## 🚀 Features

- **Premium UI/UX:** A stunning, ultra-minimalist dark mode design inspired by the Resend Design System. Utilizes **TailwindCSS**, **Framer Motion** for subtle micro-animations, and **Lucide React** for beautiful iconography.
- **Advanced Authentication:** Secure JWT-based auth with access/refresh tokens, optimized bcrypt password hashing, and auto-login flows.
- **Full Contact Management (CRUD):** Create, read, update, and delete contacts with ease.
- **Contact Profile Photos:** Upload, preview, and store profile photos using Base64 encoding.
- **High-Speed Search:** Custom-built backend search engine using a Trie data structure and Inverted Index for lightning-fast autocomplete and fuzzy search.
- **Import & Export:** Easily import contacts from CSV/JSON, and export your address book.
- **Form Validation:** End-to-end type safety and validation using **Zod** and **React Hook Form**.

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
- **Caching/Search:** Custom in-memory Search Index (Trie + Inverted Index)

---

## 💻 Getting Started

Follow these steps to get the project running locally on your machine. We use npm workspaces, so you can easily run both the frontend and backend from the root directory.

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

### 2. Install Dependencies

Install dependencies for both the frontend and backend simultaneously from the root directory:

```bash
npm install
```

### 3. Environment Variables

Create `.env` files in both the root directory and the `backend` directory.

**Root `.env` file** (You can copy from `.env.example`):
```env
MONGODB_URI=mongodb://localhost:27017/smartdirectory
JWT_SECRET=dev-jwt-secret-key-for-smartdirectory-application-12345
JWT_REFRESH_SECRET=dev-refresh-jwt-secret-key-for-smartdirectory-application-12345
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

*(You can use a local MongoDB connection or replace it with your MongoDB Atlas URI)*

### 4. Run the Development Server

Start both the frontend and backend development servers simultaneously using concurrently:

```bash
npm run dev
```

- The **Frontend** will be accessible at `http://localhost:3001` (or `http://localhost:3000` depending on port availability).
- The **Backend API** will be running on `http://localhost:5000`.

*(Note: API requests from the frontend are automatically proxied to the backend via Vite config, so you don't need a separate frontend `.env` file.)*

---

## 📦 Build for Production

To build both the frontend and backend for production environments from the root folder:

```bash
npm run build
```

Then you can start the backend server:

```bash
npm start
```

This will output static files for the frontend to `frontend/dist` which can be served via Nginx, Vercel, Netlify, or your preferred static host. The compiled backend code will be in `backend/dist`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check out the issues page if you want to contribute.

## 📝 License

This project is licensed under the MIT License.

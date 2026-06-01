# FlowBoard — Task Manager

A full-stack Kanban-style task manager with JWT authentication.

## Tech Stack
- Frontend: React, TypeScript, Tailwind CSS, Axios
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT stored in localStorage
- Deployment: Frontend → Vercel | Backend → Render

## Local Setup

### Backend
```bash
cd server
cp .env.example .env        # Add your MONGO_URI and JWT_SECRET
npm install
npm run dev                 # http://localhost:5000
```

### Frontend
```bash
cp .env.example .env        # Set VITE_API_URL=http://localhost:5000
npm install
npm run dev                 # http://localhost:5173
```

## Environment Variables

### Backend — server/.env
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

### Frontend — .env
```env
VITE_API_URL=http://localhost:5000
```

## Live Links
- Frontend: https://your-app.vercel.app
- Backend:  https://your-app.onrender.com

## Assumptions & Tradeoffs
- JWT in localStorage: simple approach, sufficient for this scope
- No email verification flow implemented
- MongoDB Atlas free tier for database
- Tasks are strictly user-scoped, no team/shared boards
- No restrictions on stage transitions (any → any allowed)
- Backend in /server subfolder for monorepo simplicity

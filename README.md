# FlowBoard — Task Manager

A full-stack Kanban-style task manager with JWT authentication.

## Tech Stack
- Frontend: React, TypeScript, Tailwind CSS, Axios, TanStack Start (SSR)
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT stored in localStorage
- Deployment: Frontend → Netlify | Backend → Render

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

## Deployment

### Frontend (Netlify)
1. Link your GitHub repository to a new site on Netlify.
2. The site configuration will be automatically loaded from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist/client`
3. Add the following **Environment Variable** in the Netlify Dashboard (Site settings -> Environment variables):
   - `VITE_API_URL` = `https://task-manager1-3ze7.onrender.com`

### Backend (Render)
1. Create a Web Service on Render linking your GitHub repository.
2. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
3. Add environment variables for `MONGO_URI` and `JWT_SECRET`.

## Live Links
- Frontend: Netlify App URL (to be provisioned)
- Backend:  https://task-manager1-3ze7.onrender.com

## Assumptions & Tradeoffs
- JWT in localStorage: simple approach, sufficient for this scope
- No email verification flow implemented
- MongoDB Atlas free tier for database
- Tasks are strictly user-scoped, no team/shared boards
- No restrictions on stage transitions (any → any allowed)
- Backend in /server subfolder for monorepo simplicity

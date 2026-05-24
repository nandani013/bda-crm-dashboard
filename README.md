# ManufactureFlow CRM

## Project Overview
ManufactureFlow CRM is a modern, SaaS‑style Customer Relationship Management and workflow platform designed for Business Development Associate (BDA) teams in manufacturing companies. It provides lead pipelines, sales tracking, client communication workflows, team performance metrics, and an activity timeline—all wrapped in a sleek dark‑mode UI with glass‑morphism cards.

## Tech Stack
- **Frontend**: React 17+ (Vite), Tailwind CSS, Context API, Axios
- **Backend**: Node.js, Express, JWT authentication, Mongoose (MongoDB)
- **Database**: MongoDB (collections: Users, Leads, Employees, Activities)
- **Styling**: Inter font, dark mode, responsive layout, smooth hover animations
- **Deployment**: Docker (optional), Vercel/Render for frontend, Render/Heroku for backend

## Key Features
- **Authentication** – Secure JWT‑based login/register with role support (admin, manager, employee, client).
- **Lead Management** – Full CRUD, pagination, search, filter by status, priority, and assignment.
- **Kanban Sales Pipeline** – Drag‑and‑drop cards, status updates in real‑time.
- **Team Management** – Employee CRUD with role/performance tracking.
- **Dashboard** – Glassmorphism analytics cards showing total leads, active deals, revenue, meetings, recent activity, performance overview.
- **Activity Timeline** – Log of lead creation, updates, deal closures, assignments, meetings.
- **Reusable UI components** – Card, Button, Sidebar, Layout, toast notifications, loading spinners.
- **Error handling** – Centralized backend error middleware and frontend toast alerts.
- **Responsive Design** – Mobile‑first layout, dark sidebar navigation.

## Installation
### Prerequisites
- Node.js >= 18
- npm >= 9
- MongoDB instance (local or Atlas)
- Git

### Steps
```bash
# Clone repository
git clone https://github.com/nandani013/bda-crm-dashboard.git
cd manufactureflow-crm

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Environment Variables
Create a `.env` file in **backend/** and **frontend/** (Vite uses `VITE_` prefix).
```
# backend/.env
MONGODB_URI=mongodb://localhost:27017/manufactureflow
JWT_SECRET=your_jwt_secret_here
PORT=5000
```
```
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application (development)
```bash
# Start backend
cd backend
npm run dev   # or node server.js

# In a new terminal, start frontend
cd ../frontend
npm run dev   # Vite dev server (http://localhost:5173)
```
The frontend automatically proxies API calls to the backend URL defined in `VITE_API_URL`.

## Build for Production
```bash
# Backend (optional compiled version)
cd backend
npm run build   # if you have a build script

# Frontend
cd ../frontend
npm run build   # generates ./dist folder
```
Serve the `frontend/dist` folder with any static server (e.g., Nginx, Vercel) and run the backend on a production‑ready environment.

## Deployment
### Docker (recommended)
```dockerfile
# Dockerfile (root)
# Backend
FROM node:20-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node","server.js"]

# Frontend
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ .
RUN npm run build

# Production image
FROM nginx:stable-alpine
COPY --from=frontend /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```
```bash
# Build and run
docker compose up --build -d
```
### Vercel / Render
- Push the repo to GitHub.
- Connect Vercel to the `frontend` folder (auto‑detects Vite).
- Connect Render (or Heroku) to the `backend` folder, set the start command to `node server.js` and add the required env vars.

### Live Demo
- https://bda-crm-dashboard-gds3.vercel.app---
# Deployment Instructions

## Live Demo
- https://bda-crm-dashboard-gds3.vercel.app

## Backend (Render)
- Add `FRONTEND_URL` env var on Render: `https://bda-crm-dashboard-gds3.vercel.app`
- Ensure `MONGODB_URI` and `JWT_SECRET` are set.

## Frontend (Vercel)
- Set `VITE_API_URL` env var to your Render backend URL, e.g. `https://bda-crm-dashboard.onrender.com/api`.
- Build command: `npm run build` (outputs to `dist/`).

*ManufactureFlow CRM – modern, scalable, and ready for production.*

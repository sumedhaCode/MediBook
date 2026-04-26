# MediBook

MediBook is a full-stack MERN/TypeScript appointment booking application for patients, doctors, and admins.

The project includes:

- React + TypeScript frontend
- Node.js + Express + TypeScript backend
- Prisma ORM
- MySQL database
- JWT authentication
- Role-based access for patients, doctors, and admins
- Doctor listings, availability, and appointment management

---

## Live URLs

### Frontend

https://medibook-3rrq.onrender.com

### Backend

https://medibook-auth-service.onrender.com

### Backend Health Check

https://medibook-auth-service.onrender.com/

Expected response:

```txt
Auth Service Running 🚀

---


## Repository
sumedhaCode/MediBook
Project Structure
MediBook/
├── backend/
│   └── auth-service/
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── src/
│       │   ├── config/
│       │   ├── middleware/
│       │   ├── routes/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.ts
Tech Stack
Frontend
React
TypeScript
Vite
Axios / Fetch API
Render Static Site
Backend
Node.js
Express
TypeScript
Prisma ORM
MySQL
JWT Authentication
bcrypt password hashing
Render Web Service
Database
MySQL hosted on Railway
Deployment
Frontend

The frontend is deployed as a Render Static Site.

Frontend URL:

https://medibook-3rrq.onrender.com

Recommended frontend environment variable:

VITE_API_URL=https://medibook-auth-service.onrender.com
Backend

The backend is deployed as a Render Web Service.

Backend URL:

https://medibook-auth-service.onrender.com

Backend root directory:

backend/auth-service

Build command:

npm install && npx prisma generate && npx prisma db push && npm run build

Start command:

npm start
Backend Environment Variables

Set these in:

Render → medibook-auth-service → Environment
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?connection_limit=5
JWT_SECRET=your_long_secure_jwt_secret
NODE_ENV=production

Example Railway MySQL public URL format:

DATABASE_URL=mysql://root:password@something.proxy.rlwy.net:PORT/railway?connection_limit=5

Do not use:

DATABASE_URL=mysql://user:password@localhost:3306/database

localhost does not work on Render because it refers to the Render container itself, not your local machine or Railway database.

Prisma Configuration

The Prisma datasource must use the environment variable:

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

Do not hardcode the database URL inside schema.prisma.

Local Development
1. Clone the repository
git clone https://github.com/sumedhaCode/MediBook.git
cd MediBook
2. Backend setup
cd backend/auth-service
npm install

Create a .env file:

DATABASE_URL=mysql://USER:PASSWORD@localhost:3306/medibook_auth
JWT_SECRET=your_local_secret
PORT=5000

Generate Prisma client:

npx prisma generate

Sync database schema:

npx prisma db push

Run backend locally:

npm run dev

Backend runs on:

http://localhost:5000
3. Frontend setup
cd frontend
npm install

Create a .env file:

VITE_API_URL=http://localhost:5000

Run frontend locally:

npm run dev
Backend Scripts

Inside backend/auth-service/package.json:

{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
API Routes

Base backend URL:

https://medibook-auth-service.onrender.com
Auth Routes
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
Doctor Routes
GET    /api/doctors
POST   /api/doctors
PUT    /api/doctors/:id
DELETE /api/doctors/:id
Appointment Routes
GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id
Availability Routes
GET  /api/availability
POST /api/availability
Admin Routes
/api/admin
Authentication

MediBook uses JWT-based authentication.

On successful login/register, the backend returns a token:

{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "patient"
  }
}

Protected routes require the token in the Authorization header:

Authorization: Bearer <token>
User Roles

MediBook supports the following roles:

patient
doctor
admin

Admin registration is blocked from public signup for security reasons.

if (role === "admin") {
  return res.status(403).json({ error: "Admin registration not allowed" });
}

Admin accounts should be created manually or seeded securely.

Database Models

Main Prisma models:

User
Doctor
Appointment
Availability

Example:

model User {
  id       Int    @id @default(autoincrement())
  name     String
  email    String @unique
  password String
  role     String @default("patient")

  appointments Appointment[]
}
Common Deployment Issues and Fixes
1. Prisma tries to connect to localhost

Error:

Can't reach database server at localhost:3306

Fix:

Make sure schema.prisma uses:

url = env("DATABASE_URL")

and Render has the Railway public MySQL URL set in DATABASE_URL.

2. Prisma P3005 error

Error:

P3005: The database schema is not empty

For this project, the simple deployment path uses:

npx prisma db push

instead of:

npx prisma migrate deploy
3. Missing build script

Error:

npm error Missing script: "build"

Fix:

Add this to backend package.json:

"build": "tsc"
4. Render cannot find TypeScript types

Error:

Cannot find type definition file for 'node'

Fix:

Ensure required build packages are installed during Render build.

The current Render build command is:

npm install && npx prisma generate && npx prisma db push && npm run build
5. Login returns User not found

This means the backend and database are connected, but the user does not exist in the production Railway database.

Fix:

Register a new user through the live frontend, or seed the production database.

Important Security Notes
Never commit real database URLs.
Never hardcode DATABASE_URL in schema.prisma.
Never expose JWT_SECRET in frontend code.
Rotate database passwords if they were pasted into chats, screenshots, commits, or public logs.
Keep production secrets only in Render environment variables.
Current Production Setup
Frontend:
Render Static Site

Frontend URL:
https://medibook-3rrq.onrender.com

Backend:
Render Web Service

Backend URL:
https://medibook-auth-service.onrender.com

Backend Root:
backend/auth-service

Database:
Railway MySQL

ORM:
Prisma

Auth:
JWT + bcrypt
Status

Deployment status:

Frontend: Live
Backend: Live
Database: Connected
Prisma: Synced
CI/CD: Green
Login API: Working
Author

Developed by Sumedha.
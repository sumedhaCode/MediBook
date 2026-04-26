# MediBook: Doctor Appointment Booking Application

A full-stack web application for booking doctor appointments. MediBook provides an intuitive interface for patients to search and book appointments, for doctors to manage their schedules, and for admins to oversee the system.

**Built with:** TypeScript (97.9%), React.js, Node.js/Express, MongoDB/Prisma

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Highlights](#project-highlights)
- [Contributing](#contributing)

---

## ✨ Features

### Role-based Access
- **Patients**: Search doctors, book appointments, view and manage appointments
- **Doctors**: Manage availability, view appointments, track patient interactions
- **Admins**: Manage users and doctors, oversee all appointments

### Search and Filters
- Search doctors by name, specialization, or location
- Dynamically filter doctors by availability
- Advanced search capabilities

### Appointment Management
- Book appointments with calendar and time slot selection
- View upcoming and past appointments
- Cancel appointments
- Real-time appointment notifications

### Responsive UI
- Fully responsive design (desktop, tablet, mobile)
- Reusable component library with shadcn/ui
- Modern UI with Tailwind CSS
- Smooth animations with Framer Motion

---

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **React Hook Form** - Efficient form handling
- **Zod** - TypeScript-first schema validation
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **Framer Motion** - Animation library
- **Recharts** - Charting library
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Backend
- **Node.js** with TypeScript
- **Express** - Web framework
- **MongoDB** with Mongoose - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **TypeScript** - Static type checking

---

## 📁 Project Structure

```
MediBook/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React Context (Auth, etc.)
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   ├── doctor/      # Doctor dashboard pages
│   │   │   └── patient/     # Patient pages
│   │   ├── lib/             # Utility functions
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
���   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── eslint.config.js
│
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/      # Route handlers
│   │   ├── models/          # Database models (Mongoose/Prisma)
│   │   ├── middleware/      # Auth, validation middleware
│   │   ├── config/          # Configuration files
│   │   └── server.ts        # Entry point
│   ├── prisma/              # Prisma schema and migrations
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example         # Environment variables template
│   └── .gitignore
│
└── README.md                # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/sumedhaCode/MediBook.git
cd MediBook
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

### 3. Setup Backend

```bash
cd ../backend
npm install
```

Create a `.env` file in the backend directory (see [Environment Variables](#environment-variables))

### 4. Setup Database

```bash
# Apply Prisma migrations
npx prisma migrate dev --name init

# (Optional) Seed database with initial data
npx prisma db seed
```

---

## 📝 Commands

### Frontend Commands

```bash
cd frontend

# Development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build locally
npm run preview

# Linting
npm run lint

# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Backend Commands

```bash
cd backend

# Development server (runs on http://localhost:3000)
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Database migration (create)
npx prisma migrate dev --name <migration_name>

# Database migration (reset)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database
npx prisma db seed

# Validate schema
npx prisma validate

# Generate Prisma client
npx prisma generate

# Linting (if configured)
npm run lint
```

### Full Stack Commands

```bash
# From project root, install all dependencies
npm install --prefix frontend && npm install --prefix backend

# Run both frontend and backend (requires separate terminals)
# Terminal 1 - Frontend
npm --prefix frontend run dev

# Terminal 2 - Backend
npm --prefix backend run dev
```

---

## 🔐 Environment Variables

### Backend `.env` File

Create `backend/.env`:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/medibook
PRISMA_DATABASE_URL=postgresql://user:password@localhost:5432/medibook

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password

# API Keys (if needed)
API_KEY=your_api_key
```

### Frontend `.env` File

Create `frontend/.env` (optional):

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=MediBook
```

---

## 📌 Project Highlights

### Key Frontend Files
- `pages/patient/SearchDoctors.tsx` – Doctor search with filters and availability
- `pages/patient/BookAppointment.tsx` – Appointment booking with calendar
- `pages/patient/PatientAppointments.tsx` – View all patient appointments
- `pages/doctor/DoctorDashboard.tsx` – Doctor's appointment management
- `pages/admin/AdminDashboard.tsx` – Admin overview and user management
- `components/DashboardLayout.tsx` – Layout wrapper with navigation
- `contexts/AuthContext.tsx` – Role-based authentication

### Key Backend Features
- JWT-based authentication
- Role-based access control (RBAC)
- Appointment scheduling logic
- Doctor availability management
- User management endpoints
- Input validation and error handling

---

## 🧪 Testing

### Frontend Testing

```bash
cd frontend

# Run all tests once
npm run test

# Run tests in watch mode during development
npm run test:watch

# Run specific test file
npm run test -- SearchDoctors.test.ts
```

### E2E Testing with Playwright

```bash
cd frontend

# Install Playwright (if not already)
npx playwright install

# Run E2E tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui

# Run specific test
npx playwright test tests/booking.spec.ts
```

---

## 🔄 API Endpoints (Backend)

### Authentication
- `POST /api/auth/register` – User registration
- `POST /api/auth/login` – User login
- `POST /api/auth/logout` – User logout
- `POST /api/auth/refresh` – Refresh token

### Doctors
- `GET /api/doctors` – List all doctors
- `GET /api/doctors/:id` – Get doctor details
- `POST /api/doctors` – Create doctor (admin only)
- `PUT /api/doctors/:id` – Update doctor profile
- `DELETE /api/doctors/:id` – Delete doctor (admin only)

### Appointments
- `GET /api/appointments` – Get user's appointments
- `POST /api/appointments` – Book appointment
- `GET /api/appointments/:id` – Get appointment details
- `PUT /api/appointments/:id` – Update appointment
- `DELETE /api/appointments/:id` – Cancel appointment

### Users (Admin)
- `GET /api/users` – List all users (admin only)
- `PUT /api/users/:id` – Update user (admin only)
- `DELETE /api/users/:id` – Delete user (admin only)

---

## 📦 Dependencies Overview

### Frontend Key Dependencies
- `react` – UI library
- `react-router-dom` – Routing
- `axios` – HTTP client
- `tailwindcss` – CSS framework
- `react-hook-form` – Form management
- `zod` – Validation
- `lucide-react` – Icons

### Backend Key Dependencies
- `express` – Web framework
- `mongoose` – MongoDB ODM
- `@prisma/client` – ORM
- `jsonwebtoken` – JWT authentication
- `bcryptjs` – Password hashing
- `cors` – CORS middleware

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📞 Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/sumedhaCode/MediBook).

---

**Happy Coding! 🎉**

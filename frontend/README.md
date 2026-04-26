# MediBook: Doctor Appointment Booking Web App

This is the frontend of the Doctor Appointment Web Application.  
It provides a user-friendly interface for **Patients, Doctors, and Admins** to manage appointments, search doctors, and access dashboards.

The frontend is built using **React.js, TypeScript, and TailwindCSS**, with a component library for UI elements.

---

## Features

### Role-based Access
- **Patients**: Search doctors, book appointments, view and manage appointments.  
- **Doctors**: Manage availability, view appointments, and track patient interactions.  
- **Admins**: Manage users and doctors, view all appointments.  

### Search and Filters
- Search doctors by **name, specialization, or location**.  
- Dynamically filter doctors.

### Appointment Management
- Book appointments (**frontend flow**).  
- View **upcoming and past appointments**.  
- Cancel appointments (**frontend interaction**).

### Responsive UI
- Works on **desktops, tablets, and mobile devices**.  
- Uses **reusable UI components**.

---

## Tech Stack
- **React.js (TypeScript)**  
- **React Router** – for navigation  
- **TailwindCSS** – styling  
- **Lucide-React** – icons  
- **sonner** – toast notifications  
- **Components** – Cards, Buttons, Input, Select, Tabs, Badge  
- **Context API** – authentication state management (role-based login)  
- Optional: Future integration with backend API for full functionality

---

## Project Structure
```
frontend/
├── public/
│ └── index.html
├── src/
│ ├── components/ 
│ ├── contexts/ 
│ ├── data/ # Mock data for doctors, appointments, filters
│ ├── lib/ 
│ ├── pages/ 
│ │ ├── admin/
│ │ ├── doctor/
│ │ └── patient/
│ ├── App.tsx
│ ├── main.tsx
│ └── index.css
├── package.json
├── tsconfig.json
└── tailwind.config.js
```
---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/rujularaut/MediBook.git
cd frontend
```

2. Install dependencies
```bash
npm install
```
4. Run the development server
```bash
npm start
```

Open in your browser: http://localhost:5173

4. Build for production
```bash
npm run build
```

The production-ready build will be in the dist/ folder.

## Notes
- Currently, the frontend uses mock data for doctors and appointments.
- To connect with a backend:
- Replace mock data with API calls (fetch or Axios) to your Node.js/Express backend.
- Update login and signup forms to call backend endpoints.
- The UI is fully functional for testing flows like login, search, and booking (frontend simulation).

## Folder Highlights
- `pages/patient/SearchDoctors.tsx` – Doctor search page with filters and availability.  
- `pages/patient/BookAppointment.tsx` – Appointment booking UI with calendar and time slots.  
- `pages/patient/PatientAppointments.tsx` – View upcoming and past appointments.  
- `components/DashboardLayout.tsx` – Layout wrapper with navigation.  
- `contexts/AuthContext.tsx` – Role-based authentication management.


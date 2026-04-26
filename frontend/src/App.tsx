import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";

import SearchDoctors from "./pages/patient/SearchDoctors";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientAppointments from "./pages/patient/PatientAppointments";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import ManageAvailability from "./pages/doctor/ManageAvailability";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDoctors from "./pages/admin/ManageDoctors";
import ManageUsers from "./pages/admin/ManageUsers";
// ❌ REMOVED: AllAppointments import

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>

            {/* PUBLIC */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* ================= PATIENT ================= */}
            <Route
              path="/patient/search"
              element={
                <ProtectedRoute role="patient">
                  <SearchDoctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/book/:doctorId"
              element={
                <ProtectedRoute role="patient">
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute role="patient">
                  <PatientAppointments />
                </ProtectedRoute>
              }
            />

            {/* ================= DOCTOR ================= */}
            <Route
              path="/doctor"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/availability"
              element={
                <ProtectedRoute role="doctor">
                  <ManageAvailability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />

            {/* ================= ADMIN ================= */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute role="admin">
                  <ManageDoctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute role="admin">
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            {/* ❌ REMOVED: /admin/appointments route */}

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
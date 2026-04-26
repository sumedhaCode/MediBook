export type UserRole = "patient" | "doctor" | "admin";

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  location: string;
  rating: number;
  experience: number;
  avatar: string;
  available: boolean;
  fee: number;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  specialization: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled" | "pending";
  type: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedDate: string;
  status: "active" | "inactive";
}

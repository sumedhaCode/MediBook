import { Doctor, Appointment, User, TimeSlot } from "@/types";

export const mockDoctors: Doctor[] = [
  { id: "1", name: "Dr. Ananya Sharma", specialization: "Cardiologist", location: "Mumbai", rating: 4.9, experience: 15, avatar: "AS", available: true, fee: 1500 },
  { id: "2", name: "Dr. Rohit Mehta", specialization: "Dermatologist", location: "Delhi", rating: 4.8, experience: 12, avatar: "RM", available: true, fee: 1200 },
  { id: "3", name: "Dr. Priya Gupta", specialization: "Pediatrician", location: "Bengaluru", rating: 4.7, experience: 10, avatar: "PG", available: false, fee: 1000 },
  { id: "4", name: "Dr. Arjun Verma", specialization: "Orthopedic", location: "Hyderabad", rating: 4.9, experience: 20, avatar: "AV", available: true, fee: 1800 },
  { id: "5", name: "Dr. Nisha Rao", specialization: "Neurologist", location: "Chennai", rating: 4.6, experience: 8, avatar: "NR", available: true, fee: 2000 },
  { id: "6", name: "Dr. Karan Singh", specialization: "Cardiologist", location: "Pune", rating: 4.8, experience: 18, avatar: "KS", available: true, fee: 1600 },
  { id: "7", name: "Dr. Meera Iyer", specialization: "Dermatologist", location: "Kolkata", rating: 4.5, experience: 7, avatar: "MI", available: true, fee: 1100 },
  { id: "8", name: "Dr. Vijay Kumar", specialization: "General Physician", location: "Ahmedabad", rating: 4.7, experience: 14, avatar: "VK", available: true, fee: 900 },
];

export const mockAppointments: Appointment[] = [
  { id: "1", patientName: "Amit Sharma", patientId: "p1", doctorName: "Dr. Ananya Sharma", doctorId: "1", specialization: "Cardiologist", date: "2026-03-24", time: "10:00 AM", status: "upcoming", type: "Consultation" },
  { id: "2", patientName: "Sneha Jain", patientId: "p2", doctorName: "Dr. Rohit Mehta", doctorId: "2", specialization: "Dermatologist", date: "2026-03-25", time: "2:00 PM", status: "pending", type: "Follow-up" },
  { id: "3", patientName: "Amit Sharma", patientId: "p1", doctorName: "Dr. Priya Gupta", doctorId: "3", specialization: "Pediatrician", date: "2026-03-20", time: "11:00 AM", status: "completed", type: "Check-up" },
  { id: "4", patientName: "Ritika Das", patientId: "p3", doctorName: "Dr. Ananya Sharma", doctorId: "1", specialization: "Cardiologist", date: "2026-03-26", time: "9:00 AM", status: "upcoming", type: "Consultation" },
  { id: "5", patientName: "Suresh Patel", patientId: "p4", doctorName: "Dr. Arjun Verma", doctorId: "4", specialization: "Orthopedic", date: "2026-03-22", time: "3:00 PM", status: "cancelled", type: "Surgery Consult" },
  { id: "6", patientName: "Pooja Reddy", patientId: "p5", doctorName: "Dr. Nisha Rao", doctorId: "5", specialization: "Neurologist", date: "2026-03-27", time: "1:00 PM", status: "pending", type: "Consultation" },
];

export const mockUsers: User[] = [
  { id: "p1", name: "Amit Sharma", email: "amit@example.com", role: "patient", joinedDate: "2025-01-15", status: "active" },
  { id: "p2", name: "Sneha Jain", email: "sneha@example.com", role: "patient", joinedDate: "2025-02-20", status: "active" },
  { id: "p3", name: "Ritika Das", email: "ritika@example.com", role: "patient", joinedDate: "2025-03-10", status: "active" },
  { id: "p4", name: "Suresh Patel", email: "suresh@example.com", role: "patient", joinedDate: "2025-04-05", status: "inactive" },
  { id: "p5", name: "Pooja Reddy", email: "pooja@example.com", role: "patient", joinedDate: "2025-05-12", status: "active" },
  { id: "d1", name: "Dr. Ananya Sharma", email: "ananya@example.com", role: "doctor", joinedDate: "2024-06-01", status: "active" },
  { id: "d2", name: "Dr. Rohit Mehta", email: "rohit@example.com", role: "doctor", joinedDate: "2024-07-15", status: "active" },
];

export const mockTimeSlots: TimeSlot[] = [
  { id: "1", time: "9:00 AM", available: true },
  { id: "2", time: "9:30 AM", available: false },
  { id: "3", time: "10:00 AM", available: true },
  { id: "4", time: "10:30 AM", available: true },
  { id: "5", time: "11:00 AM", available: false },
  { id: "6", time: "11:30 AM", available: true },
  { id: "7", time: "1:00 PM", available: true },
  { id: "8", time: "1:30 PM", available: true },
  { id: "9", time: "2:00 PM", available: false },
  { id: "10", time: "2:30 PM", available: true },
  { id: "11", time: "3:00 PM", available: true },
  { id: "12", time: "3:30 PM", available: true },
];

export const specializations = [
  "All Specializations",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic",
  "Neurologist",
  "General Physician",
];

export const locations = [
  "All Locations",
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
];
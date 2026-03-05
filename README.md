# ePager - Medical Appointment Manager

ePager is a modern, full-stack hospital appointment management system designed to streamline the connection between patients, doctors, and administrators. It's built with a robust Spring Boot backend and a dynamic React frontend. Disclaimer: This was developed for a project in my year 2 of CompSci. It isn't meant to be taken seriously.

## Features

- **Role-Based Access Control**: Secure login for Patients, Doctors, and Administrators.
- **Smart Scheduling**: 
  - Dynamic time-slot generation based on doctor and patient availability.
  - Prevention of double-booking and invalid dates.
  - Interactive calendar interface for seamless booking.
- **Real-Time Dashboards**:
  - **Doctor Dashboard**: Auto-refreshes every 5 seconds to show upcoming appointments.
  - **Admin Dashboard**: Comprehensive management of doctors, patients, and system records.

## Tech Stack

### Backend
- **Framework**: Spring Boot 3 (Java 17)
- **Database**: MongoDB
- **Security**: Spring Security with JWT Authentication
- **Documentation**: Swagger UI / OpenAPI

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: CSS Modules
- **HTTP Client**: Axios
- **Components**: React Calendar, Custom Modals

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js & npm
- MongoDB (running on `localhost:27017`)

### 1. Start the Backend
```bash
cd hospital-system/backend
mvn spring-boot:run
```
The server will start on `http://localhost:8080`.
- **API Docs**: `http://localhost:8080/swagger-ui.html`

### 2. Start the Frontend
```bash
cd hospital-system/frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## Usage Guide

1.  **Register**: Create a new patient account via the signup page.
2.  **Book Appointment**:
    - Select a doctor from the dashboard.
    - Choose a date using the intuitive calendar.
    - Pick an available time slot and confirm.
3.  **Manage Appointments**:
    - Go to "My Appointments" to view your schedule.
    - Easy rescheduling and cancellation options available.
4.  **Doctor Access**: Log in as a doctor to view your real-time schedule.
5.  **Admin Access**: Log in as admin to onboard new doctors and manage users.

---

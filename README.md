<img width="2932" height="1604" alt="sbp3" src="https://github.com/user-attachments/assets/bfb5ce90-9fe3-4265-8943-e2e3175d2190" /># ePager - Medical Appointment Manager

ePager is a modern, full-stack hospital appointment management system designed to streamline the connection between patients, doctors, and administrators. It's built with a robust Spring Boot backend and a dynamic React frontend. Disclaimer: This was developed for a project in my year 2 of CompSci. It isn't meant to be taken seriously.

## Features

- **Role-Based Access Control**: Secure login for Patients, Doctors, and Administrators.
<img width="2902" height="1604" alt="sbp1" src="https://github.com/user-attachments/assets/9ec4550d-fee4-4c11-80e5-31a0a575327e" />
  
- **Smart Scheduling**: 
  - Dynamic time-slot generation based on doctor and patient availability.
    <img width="2900" height="1604" alt="sbp2" src="https://github.com/user-attachments/assets/446431f7-d708-4e93-98c2-595873cd82be" />
  - Prevention of double-booking and invalid dates.
    <img width="2932" height="1602" alt="sbp5" src="https://github.com/user-attachments/assets/54c32730-0cb8-49cc-b025-7e28b569d362" />
  - Interactive calendar interface for seamless booking.
    <img width="2932" height="1604" alt="sbp3" src="https://github.com/user-attachments/assets/db93304f-8bbd-43da-b732-64334c9243ee" />
    <img width="2932" height="1600" alt="sbp4" src="https://github.com/user-attachments/assets/570a1102-56de-485b-ad9c-c572e8b8bcda" />

- **Real-Time Dashboards**:
  - **Doctor Dashboard**: Auto-refreshes every 5 seconds to show upcoming appointments.
    <img width="2926" height="1598" alt="sbp7" src="https://github.com/user-attachments/assets/e730b090-807a-484d-bf67-81c891fb18ba" />
  - **Admin Dashboard**: Comprehensive management of doctors, patients, and system records.
    <img width="2932" height="1602" alt="sbp8" src="https://github.com/user-attachments/assets/c7df9edc-dd99-411d-a94c-eed45eaa1800" />
    <img width="2866" height="1608" alt="sbp9" src="https://github.com/user-attachments/assets/d10f8f80-c8b9-4dfd-9614-0bc239b1a9ff" />
    <img width="2926" height="1598" alt="sbp10" src="https://github.com/user-attachments/assets/fb8ebf9d-80a0-4d4e-9891-c7a03122c06b" />

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

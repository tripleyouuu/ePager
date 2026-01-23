# Hospital Appointment System

A production-grade Hospital Appointment System built with Spring Boot (Backend) and React (Frontend).

## Features
- **Roles**: Admin, Doctor, User.
- **Appointments**: 1-hour slots, strict validation, no double-booking.
- **Doctors**: 5 pre-seeded doctors with different specializations.
- **Availability**: Dynamic slot generation based on working hours (09:00 - 15:00).
- **Security**: JWT Authentication, Stateless Session.

## Tech Stack
- **Backend**: Java 17, Spring Boot 3, Spring Data MongoDB, Spring Security (JWT).
- **Frontend**: React (Vite), Bootstrap, Axios.
- **Database**: MongoDB.

## Prerequisites
- Java 17+
- Node.js & npm
- MongoDB (running on localhost:27017)

## running the Application

### 1. Backend
```bash
cd hospital-system/backend
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`.
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 2. Frontend
```bash
cd hospital-system/frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

## Usage
1.  **Register** a new user.
2.  **Login** to access the dashboard.
3.  **View Doctors** and their details.
4.  **Book Appointment**: Select a date and a time slot.
5.  **My Appointments**: View and cancel your bookings.

## API Documentation
The API is fully documented using Swagger/OpenAPI.
Access it at: `http://localhost:8080/swagger-ui.html`

## Default Users
You can register your own users.
Doctors are pre-seeded on first run.

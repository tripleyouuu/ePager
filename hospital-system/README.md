# Hospital Appointment System

## Overview
A full-stack Hospital Appointment System built with Spring Boot (Backend) and React (Frontend).

## New Features
- **Date Restrictions**: Bookings allowed only 1-7 days in advance.
- **Rescheduling**: Patients can reschedule appointments (Date, Time, Doctor).
- **Slot Availability**: Booked slots are visible but greyed out.
- **Doctor Dashboard**: dedicated dashboard for doctors to view their schedule.

## Doctor Credentials (Pre-seeded)
Login with these credentials to access Doctor Dashboard:
- alice@hospital.com / password
- bob@hospital.com / password
- charlie@hospital.com / password
- diana@hospital.com / password
- evan@hospital.com / password

## Patient Rules
- Patients cannot view other patients' data.
- Patients can only book/reschedule their own appointments.

## Running the Application
### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm run dev
```

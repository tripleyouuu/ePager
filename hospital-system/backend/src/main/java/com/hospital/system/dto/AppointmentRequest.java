package com.hospital.system.dto;

import java.time.LocalDate;
import java.time.LocalTime;

// appointment booking request
public class AppointmentRequest {
    private String doctorId;
    private LocalDate date;
    private LocalTime startTime;

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }
}

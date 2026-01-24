package com.hospital.system.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

// represents doctor's schedule
@Document(collection = "doctor_schedules")
public class DoctorSchedule {

    @Id
    private String id;

    @Indexed
    private String doctorId;

    @Indexed(unique = true)
    private String appointmentId; // link to appointment

    private String patientName;

    private LocalDate date;

    private LocalTime startTime;

    private String status; // appointment status

    private LocalDateTime msgTimestamp = LocalDateTime.now();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(String appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getMsgTimestamp() {
        return msgTimestamp;
    }

    public void setMsgTimestamp(LocalDateTime msgTimestamp) {
        this.msgTimestamp = msgTimestamp;
    }
}

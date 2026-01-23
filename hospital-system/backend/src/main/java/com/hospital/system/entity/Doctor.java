package com.hospital.system.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;

@Document(collection = "doctors")
public class Doctor {
    @Id
    private String id;

    private String name;

    private String specialization;

    private LocalTime workingStartTime = LocalTime.of(9, 0);

    private LocalTime workingEndTime = LocalTime.of(15, 0);

    private boolean active = true;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public LocalTime getWorkingStartTime() {
        return workingStartTime;
    }

    public void setWorkingStartTime(LocalTime workingStartTime) {
        this.workingStartTime = workingStartTime;
    }

    public LocalTime getWorkingEndTime() {
        return workingEndTime;
    }

    public void setWorkingEndTime(LocalTime workingEndTime) {
        this.workingEndTime = workingEndTime;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

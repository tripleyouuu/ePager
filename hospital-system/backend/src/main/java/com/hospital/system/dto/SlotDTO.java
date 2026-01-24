package com.hospital.system.dto;

import java.time.LocalTime;

// time slot transfer object
public class SlotDTO {
    private LocalTime time;
    private String status; // available or booked

    public SlotDTO(LocalTime time, String status) {
        this.time = time;
        this.status = status;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

package com.hospital.system.controller;

import com.hospital.system.entity.Doctor;
import com.hospital.system.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{doctorId}/availability")
    public ResponseEntity<List<LocalTime>> getAvailability(
            @PathVariable String doctorId,
            @RequestParam String date) {
        return ResponseEntity.ok(doctorService.getAvailableSlots(doctorId, LocalDate.parse(date)));
    }
}

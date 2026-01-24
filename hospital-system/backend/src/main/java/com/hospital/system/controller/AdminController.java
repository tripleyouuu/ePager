package com.hospital.system.controller;

import com.hospital.system.dto.DoctorRegistrationRequest;
import com.hospital.system.entity.Appointment;
import com.hospital.system.entity.Doctor;
import com.hospital.system.entity.User;
import com.hospital.system.repository.AppointmentRepository;
import com.hospital.system.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// handles admin operations and oversight
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AppointmentRepository appointmentRepository;

    public AdminController(AdminService adminService, AppointmentRepository appointmentRepository) {
        this.adminService = adminService;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @PostMapping("/doctors")
    public ResponseEntity<Doctor> createDoctor(@RequestBody DoctorRegistrationRequest request) {
        return ResponseEntity.ok(adminService.createDoctor(request));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String id) {
        adminService.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/patients")
    public ResponseEntity<List<User>> getAllPatients() {
        return ResponseEntity.ok(adminService.getAllPatients());
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) {
        adminService.deletePatient(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/appointments/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable String doctorId) {
        return ResponseEntity.ok(appointmentRepository.findByDoctorId(doctorId));
    }

    @GetMapping("/appointments/patient/{userId}")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable String userId) {
        return ResponseEntity.ok(appointmentRepository.findByUserId(userId));
    }
}

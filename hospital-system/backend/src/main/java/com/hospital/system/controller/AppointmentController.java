package com.hospital.system.controller;

import com.hospital.system.dto.AppointmentRequest;
import com.hospital.system.entity.Appointment;
import com.hospital.system.service.AppointmentService;
import com.hospital.system.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    public AppointmentController(AppointmentService appointmentService, UserRepository userRepository) {
        this.appointmentService = appointmentService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Appointment> bookAppointment(
            @RequestBody AppointmentRequest request,
            Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        String userId = userRepository.findByEmail(email).get().getId();
        return ResponseEntity.ok(appointmentService.bookAppointment(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        String userId = userRepository.findByEmail(email).get().getId();
        return ResponseEntity.ok(appointmentService.getAppointmentsForUser(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelAppointment(
            @PathVariable String id,
            Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        String userId = userRepository.findByEmail(email).get().getId();
        appointmentService.cancelAppointment(id, userId);
        return ResponseEntity.ok().build();
    }
}

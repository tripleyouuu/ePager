package com.hospital.system.service;

import com.hospital.system.dto.AppointmentRequest;
import com.hospital.system.entity.Appointment;
import com.hospital.system.entity.AppointmentStatus;
import com.hospital.system.entity.Doctor;
import com.hospital.system.entity.User;
import com.hospital.system.exception.ResourceNotFoundException;
import com.hospital.system.repository.AppointmentRepository;
import com.hospital.system.repository.DoctorRepository;
import com.hospital.system.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public AppointmentService(AppointmentRepository appointmentRepository, DoctorRepository doctorRepository,
            UserRepository userRepository, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Appointment bookAppointment(String userId, AppointmentRequest request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (appointmentRepository.existsByDoctorIdAndAppointmentDateAndStartTime(
                request.getDoctorId(), request.getDate(), request.getStartTime())) {
            throw new RuntimeException("Slot unavailable");
        }

        if (appointmentRepository.existsByUserIdAndAppointmentDateAndStartTime(
                userId, request.getDate(), request.getStartTime())) {
            throw new RuntimeException("You already have an appointment at this time");
        }

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setUser(user);
        appointment.setAppointmentDate(request.getDate());
        appointment.setStartTime(request.getStartTime());
        appointment.setEndTime(request.getStartTime().plusHours(1));
        appointment.setStatus(AppointmentStatus.BOOKED);

        Appointment saved = appointmentRepository.save(appointment);

        emailService.sendEmail(user.getEmail(), "Appointment Confirmed",
                "Your appointment with " + doctor.getName() + " is confirmed for " + request.getDate() + " at "
                        + request.getStartTime());

        return saved;
    }

    public List<Appointment> getAppointmentsForUser(String userId) {
        return appointmentRepository.findByUserId(userId);
    }

    public void cancelAppointment(String appointmentId, String userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to cancel this appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);

        emailService.sendEmail(appointment.getUser().getEmail(), "Appointment Cancelled",
                "Your appointment has been cancelled.");
    }
}

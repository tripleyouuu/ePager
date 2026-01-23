package com.hospital.system.service;

import com.hospital.system.dto.AppointmentRequest;
import com.hospital.system.entity.Appointment;
import com.hospital.system.entity.AppointmentStatus;
import com.hospital.system.entity.Doctor;
import com.hospital.system.entity.User;
import com.hospital.system.exception.ResourceNotFoundException;
import com.hospital.system.entity.DoctorSchedule;
import com.hospital.system.repository.AppointmentRepository;
import com.hospital.system.repository.DoctorRepository;
import com.hospital.system.repository.DoctorScheduleRepository;
import com.hospital.system.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@SuppressWarnings("null")
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final DoctorScheduleRepository doctorScheduleRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, DoctorRepository doctorRepository,
            UserRepository userRepository, EmailService emailService,
            DoctorScheduleRepository doctorScheduleRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.doctorScheduleRepository = doctorScheduleRepository;
    }

    @Transactional
    public Appointment bookAppointment(String userId, AppointmentRequest request) {
        if (request.getDate().isBefore(java.time.LocalDate.now().plusDays(1)) ||
                request.getDate().isAfter(java.time.LocalDate.now().plusDays(7))) {
            throw new RuntimeException("Appointments can only be booked between 1 and 7 days from today");
        }

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

        // Sync to DoctorSchedule
        DoctorSchedule schedule = new DoctorSchedule();
        schedule.setDoctorId(doctor.getId());
        schedule.setAppointmentId(saved.getId());
        schedule.setPatientName(user.getName());
        schedule.setDate(saved.getAppointmentDate());
        schedule.setStartTime(saved.getStartTime());
        schedule.setStatus("BOOKED");
        doctorScheduleRepository.save(schedule);

        emailService.sendEmail(user.getEmail(), "Appointment Confirmed",
                "Your appointment with " + doctor.getName() + " is confirmed for " + request.getDate() + " at "
                        + request.getStartTime());

        return saved;
    }

    public List<Appointment> getAppointmentsForUser(String userId) {
        return appointmentRepository.findByUserId(userId);
    }

    public Appointment getAppointmentById(String appointmentId, String userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        return appointment;
    }

    public void cancelAppointment(String appointmentId, String userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to cancel this appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);

        // Sync to DoctorSchedule
        doctorScheduleRepository.findByAppointmentId(appointmentId).ifPresent(schedule -> {
            schedule.setStatus("CANCELLED");
            doctorScheduleRepository.save(schedule);
        });

        emailService.sendEmail(appointment.getUser().getEmail(), "Appointment Cancelled",
                "Your appointment has been cancelled.");
    }

    @Transactional
    public Appointment rescheduleAppointment(String appointmentId, String userId,
            com.hospital.system.dto.RescheduleRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to reschedule this appointment");
        }

        if (request.getDate().isBefore(java.time.LocalDate.now().plusDays(1)) ||
                request.getDate().isAfter(java.time.LocalDate.now().plusDays(7))) {
            throw new RuntimeException("Appointments can only be rescheduled between 1 and 7 days from today");
        }

        if (appointmentRepository.existsByDoctorIdAndAppointmentDateAndStartTime(
                request.getDoctorId(), request.getDate(), request.getStartTime())) {
            throw new RuntimeException("Slot unavailable");
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getDate());
        appointment.setStartTime(request.getStartTime());
        appointment.setEndTime(request.getStartTime().plusHours(1));

        Appointment saved = appointmentRepository.save(appointment);

        // Sync to DoctorSchedule
        doctorScheduleRepository.findByAppointmentId(appointmentId).ifPresent(schedule -> {
            schedule.setDoctorId(appointment.getDoctor().getId());
            schedule.setDate(appointment.getAppointmentDate());
            schedule.setStartTime(appointment.getStartTime());
            schedule.setStatus("BOOKED");
            doctorScheduleRepository.save(schedule);
        });

        emailService.sendEmail(appointment.getUser().getEmail(), "Appointment Rescheduled",
                "Your appointment has been rescheduled to " + request.getDate() + " at " + request.getStartTime());

        return saved;
    }
}

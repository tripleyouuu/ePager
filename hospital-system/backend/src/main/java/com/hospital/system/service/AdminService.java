package com.hospital.system.service;

import com.hospital.system.dto.DoctorRegistrationRequest;
import com.hospital.system.entity.Doctor;
import com.hospital.system.entity.Role;
import com.hospital.system.entity.User;
import com.hospital.system.repository.DoctorRepository;
import com.hospital.system.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.hospital.system.repository.AppointmentRepository appointmentRepository;

    public AdminService(UserRepository userRepository, DoctorRepository doctorRepository,
            PasswordEncoder passwordEncoder,
            com.hospital.system.repository.AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.appointmentRepository = appointmentRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public List<User> getAllPatients() {
        return userRepository.findByRole(Role.USER);
    }

    @Transactional
    public Doctor createDoctor(DoctorRegistrationRequest request) {
        // Create User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.DOCTOR);
        userRepository.save(user);

        // Create Doctor
        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setEmail(request.getEmail());
        doctor.setWorkingStartTime(LocalTime.of(9, 0));
        doctor.setWorkingEndTime(LocalTime.of(17, 0)); // Default hours
        return doctorRepository.save(doctor);
    }

    @Transactional
    public void deleteDoctor(String doctorId) {
        if (doctorId == null)
            return;
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Mark associated appointments as UNAVAILABLE
        List<com.hospital.system.entity.Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        for (com.hospital.system.entity.Appointment app : appointments) {
            app.setStatus(com.hospital.system.entity.AppointmentStatus.UNAVAILABLE);
            // We keep the doctor reference for now, but since we delete the doctor, it will
            // become broken.
            // On fetch, Spring Data Mongo normally sets fields with missing DBRefs to null.
            appointmentRepository.save(app);
        }

        // Delete associated User
        userRepository.findByEmail(doctor.getEmail()).ifPresent(userRepository::delete);

        // Delete Doctor
        doctorRepository.deleteById(doctorId);
    }

    @Transactional
    public void deletePatient(String userId) {
        if (userId == null)
            return;
        userRepository.deleteById(userId);
        // Cascading deletes for appointments ideally
    }
}

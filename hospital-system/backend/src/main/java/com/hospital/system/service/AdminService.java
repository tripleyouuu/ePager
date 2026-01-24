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

// handles administrative tasks
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
        // creates user account
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.DOCTOR);
        userRepository.save(user);

        // creates doctor profile
        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setEmail(request.getEmail());
        doctor.setWorkingStartTime(LocalTime.of(9, 0));
        doctor.setWorkingEndTime(LocalTime.of(17, 0)); // default working hours
        return doctorRepository.save(doctor);
    }

    @Transactional
    public void deleteDoctor(String doctorId) {
        if (doctorId == null)
            return;
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // marks appointments unavailable
        List<com.hospital.system.entity.Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        for (com.hospital.system.entity.Appointment app : appointments) {
            app.setStatus(com.hospital.system.entity.AppointmentStatus.UNAVAILABLE);
            // keeps doctor ref temporarily
            // on fetch, spring data mongo normally sets fields with missing dbrefs to null.
            appointmentRepository.save(app);
        }

        // deletes associated user
        userRepository.findByEmail(doctor.getEmail()).ifPresent(userRepository::delete);

        // deletes doctor profile
        doctorRepository.deleteById(doctorId);
    }

    @Transactional
    public void deletePatient(String userId) {
        if (userId == null)
            return;

        // marks appointments unavailable
        List<com.hospital.system.entity.Appointment> appointments = appointmentRepository.findByUserId(userId);
        for (com.hospital.system.entity.Appointment app : appointments) {
            app.setStatus(com.hospital.system.entity.AppointmentStatus.UNAVAILABLE);
            appointmentRepository.save(app);
        }

        userRepository.deleteById(userId);
        // pending cascade delete
    }
}

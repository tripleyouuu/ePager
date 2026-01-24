package com.hospital.system.config;

import com.hospital.system.entity.Doctor;
import com.hospital.system.entity.Role;
import com.hospital.system.entity.User;
import com.hospital.system.repository.DoctorRepository;
import com.hospital.system.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalTime;

@Configuration
public class DataInitializer {

        @Bean
        public CommandLineRunner initData(DoctorRepository doctorRepository, UserRepository userRepository,
                        PasswordEncoder passwordEncoder) {
                return args -> {
                        // clear existing data to fix inconsistencies
                        doctorRepository.deleteAll();
                        userRepository.deleteAll();

                        // Create 5 doctors
                        createDoctor(doctorRepository, userRepository, passwordEncoder, "Dr. Alice Smith", "Cardiology",
                                        "alice@hospital.com");
                        createDoctor(doctorRepository, userRepository, passwordEncoder, "Dr. Bob Jones", "Dermatology",
                                        "bob@hospital.com");
                        createDoctor(doctorRepository, userRepository, passwordEncoder, "Dr. Charlie Brown",
                                        "Neurology",
                                        "charlie@hospital.com");
                        createDoctor(doctorRepository, userRepository, passwordEncoder, "Dr. Diana Prince", "General",
                                        "diana@hospital.com");
                        createDoctor(doctorRepository, userRepository, passwordEncoder, "Dr. Evan Wright", "Pediatrics",
                                        "evan@hospital.com");

                        System.out.println("Database reset and Doctors seeded successfully");

                        // Create Admin
                        createAdmin(userRepository, passwordEncoder, "Admin", "admin@hospital.com");
                        System.out.println("Admin seeded successfully");
                };
        }

        private void createAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder, String name,
                        String email) {
                if (userRepository.findByEmail(email).isEmpty()) {
                        User user = new User();
                        user.setName(name);
                        user.setEmail(email);
                        user.setPassword(passwordEncoder.encode("password"));
                        user.setRole(Role.ADMIN);
                        userRepository.save(user);
                }
        }

        private void createDoctor(DoctorRepository doctorRepository, UserRepository userRepository,
                        PasswordEncoder passwordEncoder, String name, String specialization, String email) {
                // Create Doctor entity
                Doctor doctor = new Doctor();
                doctor.setName(name);
                doctor.setSpecialization(specialization);
                doctor.setEmail(email);
                doctor.setWorkingStartTime(LocalTime.of(9, 0));
                doctor.setWorkingEndTime(LocalTime.of(15, 0));
                doctorRepository.save(doctor);

                // Create User entity for login
                User user = new User();
                user.setName(name);
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode("password")); // Default password
                user.setRole(Role.DOCTOR);
                userRepository.save(user);
        }
}

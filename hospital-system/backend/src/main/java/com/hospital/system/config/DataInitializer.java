package com.hospital.system.config;

import com.hospital.system.entity.Role;
import com.hospital.system.entity.User;
import com.hospital.system.repository.DoctorRepository;
import com.hospital.system.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

// initializes application data
@Configuration
public class DataInitializer {

        @Bean
        public CommandLineRunner initData(DoctorRepository doctorRepository, UserRepository userRepository,
                        PasswordEncoder passwordEncoder) {
                return args -> {
                        // creates admin user only if not exists
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

        // createDoctor method removed
}

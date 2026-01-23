package com.hospital.system.config;

import com.hospital.system.entity.Doctor;
import com.hospital.system.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    private final DoctorRepository doctorRepository;

    public DataInitializer(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (doctorRepository.count() == 0) {
                Doctor d1 = new Doctor();
                d1.setName("Dr. John Doe");
                d1.setSpecialization("Cardiologist");
                Doctor d2 = new Doctor();
                d2.setName("Dr. Jane Smith");
                d2.setSpecialization("Dermatologist");
                Doctor d3 = new Doctor();
                d3.setName("Dr. Emily White");
                d3.setSpecialization("Pediatrician");
                Doctor d4 = new Doctor();
                d4.setName("Dr. Michael Brown");
                d4.setSpecialization("Orthopedic");
                Doctor d5 = new Doctor();
                d5.setName("Dr. Sarah Green");
                d5.setSpecialization("Neurologist");

                doctorRepository.saveAll(List.of(d1, d2, d3, d4, d5));
            }
        };
    }
}

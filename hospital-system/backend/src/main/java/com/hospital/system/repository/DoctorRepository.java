package com.hospital.system.repository;

import com.hospital.system.entity.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

// doctor repository interface
public interface DoctorRepository extends MongoRepository<Doctor, String> {
    List<Doctor> findByActiveTrue();

    java.util.Optional<Doctor> findByEmail(String email);
}

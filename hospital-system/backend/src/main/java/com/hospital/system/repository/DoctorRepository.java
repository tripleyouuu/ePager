package com.hospital.system.repository;

import com.hospital.system.entity.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DoctorRepository extends MongoRepository<Doctor, String> {
    List<Doctor> findByActiveTrue();
}

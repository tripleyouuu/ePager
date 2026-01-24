package com.hospital.system.repository;

import com.hospital.system.entity.DoctorSchedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorScheduleRepository extends MongoRepository<DoctorSchedule, String> {
    List<DoctorSchedule> findByDoctorIdOrderByDateAscStartTimeAsc(String doctorId);

    Optional<DoctorSchedule> findByAppointmentId(String appointmentId);
}

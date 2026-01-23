package com.hospital.system.repository;

import com.hospital.system.entity.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByDoctorIdAndAppointmentDate(String doctorId, LocalDate appointmentDate);

    List<Appointment> findByUserId(String userId);

    boolean existsByDoctorIdAndAppointmentDateAndStartTime(String doctorId, LocalDate appointmentDate,
            LocalTime startTime);

    boolean existsByUserIdAndAppointmentDateAndStartTime(String userId, LocalDate appointmentDate, LocalTime startTime);
}

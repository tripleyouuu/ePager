package com.hospital.system.service;

import com.hospital.system.entity.Appointment;
import com.hospital.system.entity.AppointmentStatus;
import com.hospital.system.entity.Doctor;
import com.hospital.system.repository.AppointmentRepository;
import com.hospital.system.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public DoctorService(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findByActiveTrue();
    }

    public Doctor getDoctorById(String id) {
        return doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    public List<LocalTime> getAvailableSlots(String doctorId, LocalDate date) {
        Doctor doctor = getDoctorById(doctorId);
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date);

        List<LocalTime> bookedSlots = appointments.stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                .map(Appointment::getStartTime)
                .collect(Collectors.toList());

        List<LocalTime> availableSlots = new ArrayList<>();
        LocalTime current = doctor.getWorkingStartTime();

        while (current.isBefore(doctor.getWorkingEndTime())) {
            if (!bookedSlots.contains(current)) {
                availableSlots.add(current);
            }
            current = current.plusHours(1);
        }

        return availableSlots;
    }
}

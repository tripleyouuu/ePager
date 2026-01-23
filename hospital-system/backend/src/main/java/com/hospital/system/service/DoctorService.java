package com.hospital.system.service;

import com.hospital.system.entity.Appointment;
import com.hospital.system.entity.AppointmentStatus;
import com.hospital.system.entity.Doctor;
import com.hospital.system.repository.AppointmentRepository;
import com.hospital.system.repository.DoctorRepository;
import com.hospital.system.repository.DoctorScheduleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class DoctorService {

    private final DoctorScheduleRepository doctorScheduleRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public DoctorService(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository,
            DoctorScheduleRepository doctorScheduleRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorScheduleRepository = doctorScheduleRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findByActiveTrue();
    }

    public Doctor getDoctorById(String id) {
        return doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    public List<com.hospital.system.dto.SlotDTO> getAvailableSlots(String doctorId, LocalDate date) {
        Doctor doctor = getDoctorById(doctorId);
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date);

        List<LocalTime> bookedSlots = appointments.stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                .map(Appointment::getStartTime)
                .collect(Collectors.toList());

        List<com.hospital.system.dto.SlotDTO> allSlots = new ArrayList<>();
        LocalTime current = doctor.getWorkingStartTime();

        while (current.isBefore(doctor.getWorkingEndTime())) {
            String status = bookedSlots.contains(current) ? "BOOKED" : "AVAILABLE";
            allSlots.add(new com.hospital.system.dto.SlotDTO(current, status));
            current = current.plusHours(1);
        }

        return allSlots;
    }

    public List<com.hospital.system.entity.DoctorSchedule> getDoctorAppointments(String doctorEmail) {
        Doctor doctor = doctorRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found for email: " + doctorEmail));
        return doctorScheduleRepository.findByDoctorId(doctor.getId());
    }
}

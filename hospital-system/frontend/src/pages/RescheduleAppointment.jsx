import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const RescheduleAppointment = () => {
    const { appointmentId } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch doctors
                const doctorsRes = await api.get('/doctors');
                setDoctors(doctorsRes.data);

                // Fetch current appointment details to pre-fill
                const appointmentRes = await api.get(`/appointments/${appointmentId}`);
                if (appointmentRes.data) {
                    setDoctorId(appointmentRes.data.doctor.id);
                } else if (doctorsRes.data.length > 0) {
                    setDoctorId(doctorsRes.data[0].id);
                }

            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        fetchData();
    }, [appointmentId]);

    useEffect(() => {
        if (date && doctorId) {
            const fetchSlots = async () => {
                try {
                    const response = await api.get(`/doctors/${doctorId}/availability?date=${date}`);
                    setSlots(response.data);
                } catch (err) {
                    setSlots([]);
                    console.error("Error fetching slots", err);
                }
            };
            fetchSlots();
        }
    }, [date, doctorId]);

    const handleReschedule = async () => {
        try {
            await api.put(`/appointments/${appointmentId}/reschedule`, {
                doctorId,
                date,
                startTime: selectedSlot
            });
            alert('Appointment Rescheduled Successfully!');
            navigate('/appointments');
        } catch (err) {
            setMsg('Error rescheduling: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Reschedule Appointment</h2>
            {msg && <div className="alert alert-danger">{msg}</div>}

            <div className="mb-3">
                <label>Select Doctor (Optional):</label>
                <select className="form-select" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                    {doctors.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label>Select Date:</label>
                <input type="date" className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                    max={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]}
                />
            </div>

            {date && (
                <div className="mb-3">
                    <label>Available Slots:</label>
                    <div className="d-flex flex-wrap gap-2">
                        {slots.length > 0 ? slots.map(slot => (
                            <button key={slot.time}
                                className={`btn ${selectedSlot === slot.time ? 'btn-success' : slot.status === 'BOOKED' ? 'btn-secondary disabled' : 'btn-outline-primary'}`}
                                onClick={() => slot.status === 'AVAILABLE' && setSelectedSlot(slot.time)}
                                disabled={slot.status === 'BOOKED'}>
                                {slot.time}
                            </button>
                        )) : <p>No slots available</p>}
                    </div>
                </div>
            )}

            <button className="btn btn-warning mt-3" onClick={handleReschedule} disabled={!selectedSlot}>
                Confirm Reschedule
            </button>
        </div>
    );
};

export default RescheduleAppointment;

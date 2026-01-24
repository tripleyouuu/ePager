// reschedule appointment page
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import api from '../api/axios';
import { useAlert } from '../context/AlertContext';

const RescheduleAppointment = () => {
    const { appointmentId } = useParams();
    const [date, setDate] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [doctorId, setDoctorId] = useState(null); // fetch availability doctor id
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    // date formatter
    const formatDate = (dateObj) => {
        return dateObj.toISOString().split('T')[0];
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        return timeStr.split(':').slice(0, 2).join(':');
    };

    // fetch appointment details
    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            try {
                const response = await api.get(`/appointments/${appointmentId}`);
                if (response.data && response.data.doctor) {
                    setDoctorId(response.data.doctor.id);
                } else {
                    showAlert("Could not retrieve appointment details.", "error");
                }
            } catch (err) {
                console.error("Error fetching appointment", err);
                showAlert("Failed to load appointment details.", "error");
            }
        };
        fetchAppointmentDetails();
    }, [appointmentId, showAlert]);

    // fetch available slots
    useEffect(() => {
        if (date && doctorId) {
            const dateStr = formatDate(date);
            const fetchSlots = async () => {
                try {
                    const response = await api.get(`/doctors/${doctorId}/availability?date=${dateStr}`);
                    setSlots(response.data);
                    setSelectedSlot('');
                } catch (err) {
                    console.error("Error fetching slots", err);
                    setSlots([]);
                    showAlert("Failed to fetch available slots.", "error");
                }
            };
            fetchSlots();
        }
    }, [date, doctorId, showAlert]);

    const handleReschedule = async () => {
        if (!date || !selectedSlot) return;

        try {
            await api.put(`/appointments/${appointmentId}/reschedule`, {
                doctorId, // request payload
                date: formatDate(date),
                startTime: selectedSlot
            });
            showAlert('Appointment Rescheduled Successfully!', 'info', () => {
                navigate('/appointments');
            });
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            showAlert('Error rescheduling appointment: ' + errorMsg, 'error');
        }
    };

    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const maxDate = new Date();
            maxDate.setDate(today.getDate() + 7);

            return date < today || date > maxDate;
        }
    };

    if (!doctorId) {
        return <div className="container mt-4 text-center"><p>Loading appointment details...</p></div>;
    }

    return (
        <div className="container mt-4">
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 className="text-center mb-3">Reschedule Appointment</h2>

                <div className="row d-flex" style={{ gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Select New Date</h4>
                        <Calendar
                            onChange={setDate}
                            value={date}
                            tileDisabled={tileDisabled}
                            minDate={new Date()}
                        />
                        {date && (
                            <p className="mt-3 text-center" style={{ fontWeight: '500', color: 'var(--primary-color)' }}>
                                Selected: {date.toDateString()}
                            </p>
                        )}
                    </div>

                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Select Time Slot</h4>

                        {!date && <p style={{ color: 'var(--text-secondary)' }}>Please select a date first.</p>}

                        {date && (
                            <div className="d-flex flex-wrap gap-2">
                                {slots.length > 0 ? slots.map(slot => (
                                    <button key={slot.time}
                                        className={`btn ${selectedSlot === slot.time ? 'btn-primary' : slot.status === 'BOOKED' ? 'btn-secondary disabled' : 'btn-outline-primary'}`}
                                        onClick={() => slot.status === 'AVAILABLE' && setSelectedSlot(slot.time)}
                                        disabled={slot.status === 'BOOKED'}
                                        style={{ minWidth: '80px', whiteSpace: 'nowrap' }}>
                                        {formatTime(slot.time)}
                                    </button>
                                )) : <p>No slots available for this date.</p>}
                            </div>
                        )}

                        <div className="mt-4">
                            <button
                                className="btn btn-primary w-100"
                                onClick={handleReschedule}
                                disabled={!date || !selectedSlot}
                                style={{ padding: '12px' }}
                            >
                                Confirm Reschedule
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RescheduleAppointment;

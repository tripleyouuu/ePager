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
    const [userAppointments, setUserAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserAppointments = async () => {
            try {
                const response = await api.get('/appointments');
                setUserAppointments(response.data);
            } catch (err) {
                console.error("Error fetching user appointments", err);
            }
        };
        fetchUserAppointments();
    }, []);

    // date formatter
    const formatDate = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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

            return date <= today || date > maxDate;
        }
    };

    if (!doctorId) {
        return <div className="container mt-4 text-center"><p>Loading appointment details...</p></div>;
    }

    return (
        <div className="container mt-4">
            <div className="card" style={{ margin: '0 auto' }}>
                <h2 className="text-center mb-4">Reschedule Appointment</h2>

                <div className="row">
                    <div className="col-md-6 d-flex flex-column align-items-center border-end">
                        <Calendar
                            onChange={setDate}
                            value={date}
                            tileDisabled={tileDisabled}
                            minDate={new Date()}
                            prev2Label={null}
                            next2Label={null}
                        />
                        {date && (
                            <p className="mt-3 text-center" style={{ fontWeight: '500', color: 'var(--primary-color)' }}>
                                Selected: {date.toDateString()}
                            </p>
                        )}
                    </div>

                    <div className="col-md-6 ps-md-5">
                        <h4 className="mb-4">Select Time Slot</h4>

                        {!date && (
                            <div className="d-flex align-items-center justify-content-center h-50">
                                <p style={{ color: 'var(--text-secondary)' }}>Please select a date from the calendar.</p>
                            </div>
                        )}

                        {date && (
                            <>
                                <div className="d-flex flex-wrap gap-2 mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {slots.length > 0 ? slots.map(slot => {
                                        const isConflict = userAppointments.some(app =>
                                            app.id !== appointmentId && // exclude current appointment
                                            app.appointmentDate === formatDate(date) &&
                                            app.startTime.startsWith(slot.time.substring(0, 5)) &&
                                            app.status !== 'CANCELLED'
                                        );
                                        const isBooked = slot.status === 'BOOKED' || isConflict;

                                        return (
                                            <button key={slot.time}
                                                className={`btn btn-slot ${selectedSlot === slot.time ? 'btn-slot-selected' : isBooked ? 'btn-secondary disabled' : 'btn-outline-primary'}`}
                                                onClick={() => !isBooked && setSelectedSlot(slot.time)}
                                                disabled={isBooked}
                                                style={{ minWidth: '100px', flex: '1 0 auto' }}>
                                                {formatTime(slot.time)} {isConflict && '(Booked)'}
                                            </button>
                                        )
                                    }) : <p>No slots available for this date.</p>}
                                </div>

                                <button
                                    className="btn btn-primary w-100 mt-auto btn-no-animation"
                                    onClick={handleReschedule}
                                    disabled={!date || !selectedSlot}
                                    style={{ padding: '15px', fontSize: '1.1rem' }}
                                >
                                    Confirm Reschedule
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RescheduleAppointment;

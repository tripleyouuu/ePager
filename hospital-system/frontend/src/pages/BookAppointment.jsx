// appointment booking page
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import api from '../api/axios';
import { useAlert } from '../context/AlertContext';

const BookAppointment = () => {
    const { doctorId } = useParams();
    const [date, setDate] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
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

    useEffect(() => {
        if (date) {
            const dateStr = formatDate(date);
            const fetchSlots = async () => {
                try {
                    const response = await api.get(`/doctors/${doctorId}/availability?date=${dateStr}`);
                    setSlots(response.data);
                    setSelectedSlot(''); // reset slot
                } catch (err) {
                    console.error("Error fetching slots", err);
                    showAlert("Failed to fetch available slots. Please try again.", "error");
                }
            };
            fetchSlots();
        }
    }, [date, doctorId, showAlert]);

    const handleBook = async () => {
        if (!date || !selectedSlot) return;

        try {
            await api.post('/appointments', {
                doctorId,
                date: formatDate(date),
                startTime: selectedSlot
            });
            showAlert('Appointment Booked Successfully!', 'info', () => {
                navigate('/appointments');
            });
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            showAlert('Error booking appointment: ' + errorMsg, 'error');
        }
    };

    // disable invalid dates
    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const maxDate = new Date();
            maxDate.setDate(today.getDate() + 7);

            return date <= today || date > maxDate;
        }
    };

    return (
        <div className="container mt-4">
            <div className="card" style={{ margin: '0 auto' }}>
                <h2 className="text-center mb-4">Book Appointment</h2>

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
                                    onClick={handleBook}
                                    disabled={!date || !selectedSlot}
                                    style={{ padding: '15px', fontSize: '1.1rem' }}
                                >
                                    Confirm Booking
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;

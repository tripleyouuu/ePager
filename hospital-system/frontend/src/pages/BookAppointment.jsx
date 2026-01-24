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
    const navigate = useNavigate();

    // Helper to format date as YYYY-MM-DD for backend
    const formatDate = (dateObj) => {
        return dateObj.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (date) {
            const dateStr = formatDate(date);
            const fetchSlots = async () => {
                try {
                    const response = await api.get(`/doctors/${doctorId}/availability?date=${dateStr}`);
                    setSlots(response.data);
                    setSelectedSlot(''); // Reset slot on date change
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

    // Disable past dates and dates beyond 7 days
    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const maxDate = new Date();
            maxDate.setDate(today.getDate() + 7);

            return date < today || date > maxDate;
        }
    };

    return (
        <div className="container mt-4">
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 className="text-center mb-3">Book Appointment</h2>

                <div className="row d-flex" style={{ gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Select Date</h4>
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
                                        style={{ minWidth: '80px' }}>
                                        {slot.time}
                                    </button>
                                )) : <p>No slots available for this date.</p>}
                            </div>
                        )}

                        <div className="mt-4">
                            <button
                                className="btn btn-primary w-100"
                                onClick={handleBook}
                                disabled={!date || !selectedSlot}
                                style={{ padding: '12px' }}
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;

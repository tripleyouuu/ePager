import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const BookAppointment = () => {
    const { doctorId } = useParams();
    const [date, setDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(''); // Use string for value handling
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (date) {
            const fetchSlots = async () => {
                try {
                    const response = await api.get(`/doctors/${doctorId}/availability?date=${date}`);
                    setSlots(response.data);
                } catch (err) {
                    console.error("Error fetching slots", err);
                }
            };
            fetchSlots();
        }
    }, [date, doctorId]);

    const handleBook = async () => {
        try {
            // Need to append :00 for full LocalTime format if backend expects 09:00:00 or just 09:00
            // Backend LocalTime usually handles HH:mm:ss or HH:mm
            await api.post('/appointments', {
                doctorId,
                date,
                startTime: selectedSlot
            });
            alert('Appointment Booked Successfully!');
            navigate('/appointments');
        } catch (err) {
            setMsg('Error booking appointment: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Book Appointment</h2>
            {msg && <div className="alert alert-danger">{msg}</div>}
            <div className="mb-3">
                <label>Select Date:</label>
                <input type="date" className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    max={new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]}
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

            <button className="btn btn-primary mt-3" onClick={handleBook} disabled={!selectedSlot}>
                Confirm Booking
            </button>
        </div>
    );
};

export default BookAppointment;

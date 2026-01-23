import { useState, useEffect } from 'react';
import api from '../api/axios';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel?')) {
            try {
                await api.delete(`/appointments/${id}`);
                fetchAppointments();
            } catch (err) {
                alert('Failed to cancel');
            }
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [newSlot, setNewSlot] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (showModal && selectedAppointment && newDate) {
            const fetchSlots = async () => {
                try {
                    const response = await api.get(`/doctors/${selectedAppointment.doctor.id}/availability?date=${newDate}`);
                    setSlots(response.data);
                } catch (err) {
                    console.error("Error fetching slots", err);
                }
            };
            fetchSlots();
        }
    }, [newDate, showModal, selectedAppointment]);

    const openRescheduleModal = (app) => {
        setSelectedAppointment(app);
        setNewDate('');
        setNewSlot('');
        setSlots([]);
        setMsg('');
        setShowModal(true);
    };

    const handleRescheduleSubmit = async () => {
        if (!selectedAppointment || !newDate || !newSlot) return;

        try {
            await api.put(`/appointments/${selectedAppointment.id}/reschedule`, {
                doctorId: selectedAppointment.doctor.id,
                date: newDate,
                startTime: newSlot
            });
            alert('Rescheduled Successfully');
            setShowModal(false);
            fetchAppointments();
        } catch (err) {
            setMsg('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="container mt-4">
            <h2>My Appointments</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(app => (
                        <tr key={app.id}>
                            <td>{app.doctor.name}</td>
                            <td>{app.appointmentDate}</td>
                            <td>{app.startTime}</td>
                            <td>{app.status}</td>
                            <td>
                                {app.status === 'BOOKED' && (
                                    <>
                                        <button className="btn btn-danger btn-sm me-2" onClick={() => handleCancel(app.id)}>
                                            Cancel
                                        </button>
                                        <button className="btn btn-warning btn-sm" onClick={() => openRescheduleModal(app)}>
                                            Reschedule
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Reschedule Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reschedule Appointment</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {msg && <div className="alert alert-danger">{msg}</div>}
                                <p><strong>Doctor:</strong> {selectedAppointment?.doctor.name}</p>

                                <div className="mb-3">
                                    <label>Select New Date:</label>
                                    <input type="date" className="form-control"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                                        max={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]}
                                    />
                                </div>

                                {newDate && (
                                    <div className="mb-3">
                                        <label>Available Slots:</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {slots.map(slot => (
                                                <button key={slot.time}
                                                    className={`btn ${newSlot === slot.time ? 'btn-success' : slot.status === 'BOOKED' ? 'btn-secondary disabled' : 'btn-outline-primary'}`}
                                                    onClick={() => slot.status === 'AVAILABLE' && setNewSlot(slot.time)}
                                                    disabled={slot.status === 'BOOKED'}>
                                                    {slot.time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleRescheduleSubmit} disabled={!newSlot}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointments;

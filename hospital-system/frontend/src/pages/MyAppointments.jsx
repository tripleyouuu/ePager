// user appointments page
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAlert } from '../context/AlertContext';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (err) {
            console.error(err);
            showAlert("Failed to load appointments", "error");
        }
    };

    const handleCancel = async (id) => {
        showAlert('Are you sure you want to cancel this appointment?', 'confirmation', async () => {
            try {
                await api.delete(`/appointments/${id}`);
                showAlert('Appointment Cancelled Successfully', 'info');
                fetchAppointments();
            } catch (err) {
                showAlert('Failed to cancel appointment', 'error');
            }
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        return timeStr.split(':').slice(0, 2).join(':');
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">My Appointments</h2>
            {appointments.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <thead style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                            <tr>
                                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Doctor</th>
                                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Date</th>
                                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Time</th>
                                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(app => (
                                <tr key={app.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: '12px 15px' }}>{app.doctor ? app.doctor.name : 'Doctor Unavailable'}</td>
                                    <td style={{ padding: '12px 15px' }}>{app.appointmentDate}</td>
                                    <td style={{ padding: '12px 15px' }}>{formatTime(app.startTime)}</td>
                                    <td style={{ padding: '12px 15px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem',
                                            backgroundColor: app.status === 'BOOKED' ? '#dff9fb' : '#ff7675',
                                            color: app.status === 'BOOKED' ? '#2d3436' : 'white'
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 15px' }}>
                                        {(app.status === 'BOOKED' && app.doctor) && (
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.9rem' }} onClick={() => handleCancel(app.id)}>
                                                    Cancel
                                                </button>
                                                <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.9rem' }} onClick={() => navigate(`/reschedule/${app.id}`)}>
                                                    Reschedule
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center mt-5">
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>You have no appointments scheduled.</p>
                </div>
            )}
        </div>
    );
};

export default MyAppointments;

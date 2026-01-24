import { useState, useEffect } from 'react';
import api from '../api/axios';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await api.get('/doctors/appointments');
                setAppointments(response.data);
            } catch (err) {
                console.error("Error fetching doctor appointments", err);
            }
        };

        // Poll every 5 seconds for real-time updates
        fetchAppointments();
        const interval = setInterval(fetchAppointments, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mt-4">
            <h2>Doctor Dashboard</h2>
            <div className="card shadow">
                <div className="card-body">
                    <h5 className="card-title">Upcoming Appointments</h5>
                    {appointments.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <thead style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                                    <tr>
                                        <th style={{ padding: '12px 15px', textAlign: 'left' }}>Date</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left' }}>Time</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left' }}>Patient Name</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(app => (
                                        <tr key={app.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <td style={{ padding: '12px 15px' }}>{app.date}</td>
                                            <td style={{ padding: '12px 15px' }}>{app.startTime}</td>
                                            <td style={{ padding: '12px 15px' }}>{app.patientName || 'Unknown'}</td>
                                            <td style={{ padding: '12px 15px' }}>
                                                <span className={`badge ${app.status === 'BOOKED' ? 'bg-primary' : 'bg-danger'}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center mt-3">No appointments found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;

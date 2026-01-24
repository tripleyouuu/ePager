// doctor dashboard
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

        // poll for updates
        fetchAppointments();
        const interval = setInterval(fetchAppointments, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mt-4">
            <h2>Doctor Dashboard</h2>
            <div className="card shadow">
                <div className="card-body">
                    {appointments.length > 0 ? (
                        <>
                            <h4 className="mb-3">Upcoming Appointments</h4>
                            <div className="mb-4" style={{ overflowX: 'auto' }}>
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
                                        {appointments.filter(a => a.status === 'BOOKED').length > 0 ? (
                                            appointments.filter(a => a.status === 'BOOKED').map(app => (
                                                <tr key={app.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                    <td style={{ padding: '12px 15px' }}>{app.date}</td>
                                                    <td style={{ padding: '12px 15px' }}>{app.startTime}</td>
                                                    <td style={{ padding: '12px 15px' }}>{app.patientName || 'Unknown'}</td>
                                                    <td style={{ padding: '12px 15px' }}>
                                                        <span className="badge bg-primary">
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center p-3">No upcoming appointments.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <br/>
                            <h4 className="mb-3">Cancelled Appointments</h4>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                    <thead style={{ backgroundColor: '#636e72', color: 'white' }}>
                                        <tr>
                                            <th style={{ padding: '12px 15px', textAlign: 'left' }}>Date</th>
                                            <th style={{ padding: '12px 15px', textAlign: 'left' }}>Time</th>
                                            <th style={{ padding: '12px 15px', textAlign: 'left' }}>Patient Name</th>
                                            <th style={{ padding: '12px 15px', textAlign: 'left' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.filter(a => a.status !== 'BOOKED').length > 0 ? (
                                            appointments.filter(a => a.status !== 'BOOKED').map(app => (
                                                <tr key={app.id} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: '#f9f9f9' }}>
                                                    <td style={{ padding: '12px 15px', color: '#636e72' }}>{app.date}</td>
                                                    <td style={{ padding: '12px 15px', color: '#636e72' }}>{app.startTime}</td>
                                                    <td style={{ padding: '12px 15px', color: '#636e72' }}>{app.patientName || 'Unknown'}</td>
                                                    <td style={{ padding: '12px 15px' }}>
                                                        <span className="badge bg-danger">
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center p-3">No past or cancelled appointments.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <p className="text-center mt-3">No appointments found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;

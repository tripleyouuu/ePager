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
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Patient Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length > 0 ? appointments.map(app => (
                                <tr key={app.id}>
                                    <td>{app.date}</td>
                                    <td>{app.startTime}</td>
                                    <td>{app.patientName || 'Unknown'}</td>
                                    <td>
                                        <span className={`badge ${app.status === 'BOOKED' ? 'bg-primary' : 'bg-danger'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No appointments found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;

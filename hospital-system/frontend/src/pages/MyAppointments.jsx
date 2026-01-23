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
                                        <a href={`/reschedule/${app.id}`} className="btn btn-warning btn-sm">
                                            Reschedule
                                        </a>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyAppointments;

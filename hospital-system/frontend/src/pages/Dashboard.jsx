// patient dashboard
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.get('/doctors');
                setDoctors(response.data);
            } catch (err) {
                console.error("Error fetching doctors", err);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Available Doctors</h2>
            <div className="row">
                {doctors.map(doctor => (
                    <div className="col-md-4 mb-3" key={doctor.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{doctor.name}</h5>
                                <p className="card-text">{doctor.specialization}</p>
                                <p className="card-text">
                                    <small className="text-muted">
                                        Hours: {doctor.workingStartTime} - {doctor.workingEndTime}
                                    </small>
                                </p>
                                <Link to={`/book/${doctor.id}`} className="btn btn-primary">Book Appointment</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('doctors');
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedEntityId, setSelectedEntityId] = useState(null);

    // New Doctor Form State
    const [newDoctor, setNewDoctor] = useState({
        name: '',
        email: '',
        password: '',
        specialization: ''
    });

    useEffect(() => {
        if (activeTab === 'doctors') fetchDoctors();
        if (activeTab === 'patients') fetchPatients();
    }, [activeTab]);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/admin/doctors');
            setDoctors(res.data);
            setSelectedEntityId(null);
            setAppointments([]);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPatients = async () => {
        try {
            const res = await api.get('/admin/patients');
            setPatients(res.data);
            setSelectedEntityId(null);
            setAppointments([]);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAppointments = async (id, type) => {
        try {
            const res = await api.get(`/admin/appointments/${type}/${id}`);
            setAppointments(res.data);
            setSelectedEntityId(id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteDoctor = async (id) => {
        if (!window.confirm("Delete this doctor? This cannot be undone.")) return;
        try {
            await api.delete(`/admin/doctors/${id}`);
            fetchDoctors();
        } catch (err) {
            alert("Failed to delete doctor");
        }
    };

    const handleDeletePatient = async (id) => {
        if (!window.confirm("Delete this patient? This cannot be undone.")) return;
        try {
            await api.delete(`/admin/patients/${id}`);
            fetchPatients();
        } catch (err) {
            alert("Failed to delete patient");
        }
    };

    const handleCreateDoctor = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/doctors', newDoctor);
            alert("Doctor created successfully");
            setNewDoctor({ name: '', email: '', password: '', specialization: '' });
            fetchDoctors();
        } catch (err) {
            alert("Failed to create doctor: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Admin Dashboard</h2>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'doctors' ? 'active' : ''}`}
                        onClick={() => setActiveTab('doctors')}>Manage Doctors</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'patients' ? 'active' : ''}`}
                        onClick={() => setActiveTab('patients')}>Manage Patients</button>
                </li>
            </ul>

            {activeTab === 'doctors' && (
                <div>
                    <div className="card mb-4">
                        <div className="card-header">Create New Doctor</div>
                        <div className="card-body">
                            <form onSubmit={handleCreateDoctor} className="row g-3">
                                <div className="col-md-3">
                                    <input type="text" className="form-control" placeholder="Name" required
                                        value={newDoctor.name} onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })} />
                                </div>
                                <div className="col-md-3">
                                    <input type="email" className="form-control" placeholder="Email" required
                                        value={newDoctor.email} onChange={e => setNewDoctor({ ...newDoctor, email: e.target.value })} />
                                </div>
                                <div className="col-md-3">
                                    <input type="password" className="form-control" placeholder="Password" required
                                        value={newDoctor.password} onChange={e => setNewDoctor({ ...newDoctor, password: e.target.value })} />
                                </div>
                                <div className="col-md-3">
                                    <input type="text" className="form-control" placeholder="Specialization" required
                                        value={newDoctor.specialization} onChange={e => setNewDoctor({ ...newDoctor, specialization: e.target.value })} />
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary">Create Doctor</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(doc => (
                                <tr key={doc.id}>
                                    <td>{doc.name}</td>
                                    <td>{doc.specialization}</td>
                                    <td>{doc.email}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info me-2" onClick={() => fetchAppointments(doc.id, 'doctor')}>
                                            View Appointments
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteDoctor(doc.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'patients' && (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.email}</td>
                                <td>
                                    <button className="btn btn-sm btn-info me-2" onClick={() => fetchAppointments(p.id, 'patient')}>
                                        View Appointments
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeletePatient(p.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Appointment Viewer Section */}
            {selectedEntityId && (
                <div className="mt-4">
                    <h3>Appointments for Selected User</h3>
                    {appointments.length > 0 ? (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(app => (
                                    <tr key={app.id}>
                                        <td>{app.id}</td>
                                        <td>{app.appointmentDate}</td>
                                        <td>{app.startTime}</td>
                                        <td>{app.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p>No appointments found.</p>}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

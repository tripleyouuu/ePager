// admin dashboard
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAlert } from '../context/AlertContext';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('doctors');
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedEntityId, setSelectedEntityId] = useState(null);
    const { showAlert } = useAlert();

    // new doctor form state
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

    const appointmentsRef = useRef(null);

    // ... existing code ...

    const fetchAppointments = async (id, type) => {
        try {
            const res = await api.get(`/admin/appointments/${type}/${id}`);
            setAppointments(res.data);
            setSelectedEntityId(id);
            // scroll to appointments table
            setTimeout(() => {
                appointmentsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteDoctor = async (id) => {
        showAlert("Delete this doctor? This cannot be undone.", "confirmation", async () => {
            try {
                await api.delete(`/admin/doctors/${id}`);
                fetchDoctors();
                showAlert("Doctor deleted successfully", "info");
            } catch (err) {
                showAlert("Failed to delete doctor", "error");
            }
        });
    };

    const handleDeletePatient = async (id) => {
        showAlert("Delete this patient? This cannot be undone.", "confirmation", async () => {
            try {
                await api.delete(`/admin/patients/${id}`);
                fetchPatients();
                showAlert("Patient deleted successfully", "info");
            } catch (err) {
                showAlert("Failed to delete patient", "error");
            }
        });
    };

    const handleCreateDoctor = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/doctors', newDoctor);
            showAlert("Doctor created successfully", "info");
            setNewDoctor({ name: '', email: '', password: '', specialization: '' });
            fetchDoctors();
        } catch (err) {
            showAlert("Failed to create doctor: " + (err.response?.data?.error || err.message), "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Admin Dashboard</h2>
            <ul className="nav nav-tabs mb-4" style={{ display: 'flex', gap: '10px', listStyle: 'none', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                <li className="nav-item">
                    <button
                        className="btn"
                        style={{
                            backgroundColor: activeTab === 'doctors' ? 'var(--primary-color)' : 'white',
                            color: activeTab === 'doctors' ? 'white' : 'var(--primary-color)',
                            border: '1px solid var(--primary-color)',
                            transform: 'none',
                            boxShadow: 'none',
                            marginTop: 0
                        }}
                        onClick={() => setActiveTab('doctors')}>Manage Doctors</button>
                </li>
                <li className="nav-item">
                    <button
                        className="btn"
                        style={{
                            backgroundColor: activeTab === 'patients' ? 'var(--primary-color)' : 'white',
                            color: activeTab === 'patients' ? 'white' : 'var(--primary-color)',
                            border: '1px solid var(--primary-color)',
                            transform: 'none',
                            boxShadow: 'none',
                            marginTop: 0
                        }}
                        onClick={() => setActiveTab('patients')}>Manage Patients</button>
                </li>
            </ul>

            {activeTab === 'doctors' && (
                <div>
                    <div className="card mb-4">
                        <h4 className="card-header">Create New Doctor</h4>
                        <div className="card-body">
                            <form onSubmit={handleCreateDoctor} className="d-flex flex-wrap gap-3 align-items-center">
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <input type="text" className="form-control" placeholder="Name" required
                                        value={newDoctor.name} onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })} />
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <input type="email" className="form-control" placeholder="Email" required
                                        value={newDoctor.email} onChange={e => setNewDoctor({ ...newDoctor, email: e.target.value })} />
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <input type="password" className="form-control" placeholder="Password" required
                                        value={newDoctor.password} onChange={e => setNewDoctor({ ...newDoctor, password: e.target.value })} />
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <input type="text" className="form-control" placeholder="Specialization" required
                                        value={newDoctor.specialization} onChange={e => setNewDoctor({ ...newDoctor, specialization: e.target.value })} />
                                </div>
                                <div style={{ flex: '0 0 auto' }}>
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: 0 }}>Create Doctor</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {doctors.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <thead style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                                    <tr>
                                        <th style={{ padding: '12px 15px', textAlign: 'left' }}>Name</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left' }}>Specialization</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left' }}>Email</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.map(doc => (
                                        <tr key={doc.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <td style={{ padding: '12px 15px' }}>{doc.name}</td>
                                            <td style={{ padding: '12px 15px' }}>{doc.specialization}</td>
                                            <td style={{ padding: '12px 15px' }}>{doc.email}</td>
                                            <td style={{ padding: '12px 15px' }}>
                                                <button className="btn btn-secondary btn-sm me-2" onClick={() => fetchAppointments(doc.id, 'doctor')} style={{ marginRight: '8px' }}>
                                                    View Appts
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDoctor(doc.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-center mt-3">No doctors found.</p>}
                </div>
            )}

            {activeTab === 'patients' && (
                patients.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <thead style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                                <tr>
                                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>Name</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '12px 15px' }}>{p.name}</td>
                                        <td style={{ padding: '12px 15px' }}>{p.email}</td>
                                        <td style={{ padding: '12px 15px' }}>
                                            <button className="btn btn-secondary btn-sm me-2" onClick={() => fetchAppointments(p.id, 'patient')} style={{ marginRight: '8px' }}>
                                                View Appts
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeletePatient(p.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p className="text-center mt-3">No patients found.</p>
            )}

            {/* appointment viewer */}
            {selectedEntityId && (
                <div className="mt-4 card" ref={appointmentsRef}>
                    <h3>Appointments for Selected User</h3>
                    {appointments.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <thead style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                                    <tr>
                                        <th style={{ padding: '12px 15px', textAlign: 'left' }}>ID</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left' }}>
                                            {activeTab === 'doctors' ? 'Patient' : 'Doctor'}
                                        </th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left' }}>Date</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left' }}>Time</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(app => (
                                        <tr key={app.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <td style={{ padding: '12px 15px' }}>{app.id}</td>
                                            {activeTab === 'doctors' ? (
                                                <td style={{ padding: '12px 15px' }}>{app.user ? app.user.name : 'Unknown/Deleted'}</td>
                                            ) : (
                                                <td style={{ padding: '12px 15px' }}>{app.doctor ? app.doctor.name : 'Unknown/Deleted'}</td>
                                            )}
                                            <td style={{ padding: '12px 15px' }}>{app.appointmentDate}</td>
                                            <td style={{ padding: '12px 15px' }}>{app.startTime}</td>
                                            <td style={{ padding: '12px 15px' }}>{app.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-center" style={{ padding: '20px' }}>No appointments found.</p>}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

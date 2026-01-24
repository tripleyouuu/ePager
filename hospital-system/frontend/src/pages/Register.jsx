// user registration page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { login } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', formData);
            login(response.data);
            showAlert('Registration successful! Welcome to ePager.', 'info');
            navigate('/');
        } catch (err) {
            showAlert(err.response?.data?.message || 'Registration failed', 'error');
        }
    };

    return (
        <div style={{
            position: 'relative',
            minHeight: 'calc(100vh - 70px)', // adjust for navbar
            overflow: 'hidden'
        }}>
            {/* Background Image */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(/src/assets/auth_background.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: -1
            }} />

            <div className="container mt-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                        <h2 className="text-center mb-3">Register</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>Name</label>
                                <input type="text" className="form-control"
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label>Email</label>
                                <input type="email" className="form-control"
                                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label>Password</label>
                                <input type="password" className="form-control"
                                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Register</button>
                        </form>
                        <div className="mt-3 text-center">
                            <small>Already have an account? <a href="/login">Login</a></small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

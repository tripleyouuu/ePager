// login page
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    // redirect if logged in
    if (user) {
        if (user.role === 'DOCTOR') {
            return <Navigate to="/doctor-dashboard" />;
        } else if (user.role === 'ADMIN') {
            return <Navigate to="/admin-dashboard" />;
        } else {
            return <Navigate to="/dashboard" />;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            const userData = response.data;
            login(userData);

            // role-based navigation
            const target = userData.role === 'DOCTOR' ? '/doctor-dashboard' :
                userData.role === 'ADMIN' ? '/admin-dashboard' :
                    '/dashboard';

            navigate(target);
        } catch (err) {
            showAlert('Invalid credentials. Please check your email and password.', 'error');
        }
    };

    return (
        <div style={{
            position: 'relative',
            minHeight: 'calc(100vh - 70px)',
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
                        <h2 className="text-center mb-3">Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>Email</label>
                                <input type="email" className="form-control"
                                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label>Password</label>
                                <input type="password" className="form-control"
                                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                        <div className="mt-3 text-center">
                            <small>Don't have an account? <a href="/register">Register</a></small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

// navigation bar component
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="ePager Logo" />
                    <div className="d-flex flex-column" style={{ lineHeight: '1.2' }}>
                        <span>ePager</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '400', opacity: '0.9' }}>Medical Appointment Manager</span>
                    </div>
                </Link>

                {/* Watermark for auth pages, otherwise Navigation items */}
                {(location.pathname === '/login' || location.pathname === '/register') ? (
                    <span style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                        fontStyle: 'italic',
                        fontWeight: '500'
                    }}>
                        SpringBoot Project by Sai Sevithaa
                    </span>
                ) : (
                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link" style={{ cursor: 'default' }}>
                                        {user.role === 'DOCTOR' ? `Welcome, ${user.name}!` :
                                            user.role === 'ADMIN' ? 'Welcome, Admin' :
                                                `Welcome, ${user.name}!`}
                                    </span>
                                </li>

                                {user.role === 'USER' && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/appointments">My Appointments</Link>
                                    </li>
                                )}

                                <li className="nav-item">
                                    <button className="btn btn-outline-primary"
                                        style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
                                        onClick={handleLogout}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = 'white';
                                            e.currentTarget.style.color = 'var(--primary-color)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                    >
                                        Log Out
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-secondary" style={{ textDecoration: 'none' }} to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

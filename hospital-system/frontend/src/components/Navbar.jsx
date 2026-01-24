import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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

                <ul className="navbar-nav">
                    {user ? (
                        <>
                            <li className="nav-item">
                                <span className="nav-link" style={{ cursor: 'default' }}>
                                    {user.role === 'DOCTOR' ? `Welcome, Dr. ${user.name}!` :
                                        user.role === 'ADMIN' ? 'Welcome, Admin' :
                                            `Welcome, ${user.name}!`}
                                </span>
                            </li>

                            {user.role === 'USER' && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/appointments">My Appointments</Link>
                                </li>
                            )}

                            {user.role === 'DOCTOR' && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/doctor-dashboard">Dashboard</Link>
                                </li>
                            )}

                            {user.role === 'ADMIN' && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin-dashboard">Dashboard</Link>
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
            </div>
        </nav>
    );
};

export default Navbar;

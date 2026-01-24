import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import RescheduleAppointment from './pages/RescheduleAppointment';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';

const RoleRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (!allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard if they try to access unauthorized route
        if (user.role === 'DOCTOR') return <Navigate to="/doctor-dashboard" />;
        if (user.role === 'ADMIN') return <Navigate to="/admin-dashboard" />;
        return <Navigate to="/dashboard" />;
    }
    return children;
};

const RootRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (user.role === 'DOCTOR') return <Navigate to="/doctor-dashboard" />;
    if (user.role === 'ADMIN') return <Navigate to="/admin-dashboard" />;
    return <Navigate to="/dashboard" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AlertProvider>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/" element={<RootRedirect />} />

                        <Route path="/appointments" element={
                            <RoleRoute allowedRoles={['USER']}>
                                <MyAppointments />
                            </RoleRoute>
                        } />

                        <Route path="/book/:doctorId" element={
                            <RoleRoute allowedRoles={['USER']}>
                                <BookAppointment />
                            </RoleRoute>
                        } />

                        <Route path="/reschedule/:appointmentId" element={
                            <RoleRoute allowedRoles={['USER']}>
                                <RescheduleAppointment />
                            </RoleRoute>
                        } />

                        <Route path="/doctor-dashboard" element={
                            <RoleRoute allowedRoles={['DOCTOR']}>
                                <DoctorDashboard />
                            </RoleRoute>
                        } />

                        <Route path="/admin-dashboard" element={
                            <RoleRoute allowedRoles={['ADMIN']}>
                                <AdminDashboard />
                            </RoleRoute>
                        } />

                        {/* Fallback for Dashboard route if meant for generic or patient */}
                        <Route path="/dashboard" element={
                            <RoleRoute allowedRoles={['USER']}>
                                <Dashboard />
                            </RoleRoute>
                        } />

                    </Routes>
                </AlertProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;

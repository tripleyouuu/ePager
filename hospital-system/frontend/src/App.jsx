import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import RescheduleAppointment from './pages/RescheduleAppointment';
import DoctorDashboard from './pages/DoctorDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

const RoleRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (!allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard if they try to access unauthorized route
        return user.role === 'DOCTOR' ? <Navigate to="/doctor-dashboard" /> : <Navigate to="/dashboard" />;
    }
    return children;
};

const RootRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return user.role === 'DOCTOR' ? <Navigate to="/doctor-dashboard" /> : <Navigate to="/dashboard" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
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

                    {/* Fallback for Dashboard route if meant for generic or patient */}
                    <Route path="/dashboard" element={
                        <RoleRoute allowedRoles={['USER']}>
                            <Dashboard />
                        </RoleRoute>
                    } />

                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;

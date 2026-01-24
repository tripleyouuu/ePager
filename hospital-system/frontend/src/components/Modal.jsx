import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, type, message, onClose, onConfirm }) => {
    useEffect(() => {
        let timer;
        if (isOpen && type === 'info') {
            timer = setTimeout(() => {
                onClose();
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [isOpen, type, onClose]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div className="card" style={{
                minWidth: '300px',
                maxWidth: '500px',
                animation: 'slideUp 0.3s ease-out'
            }}>
                <h3 style={{ color: type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)' }}>
                    {type === 'error' ? 'Error' : type === 'confirmation' ? 'Confirm' : 'Notice'}
                </h3>
                <p className="mb-3">{message}</p>
                <div className="d-flex justify-content-end gap-2">
                    {type === 'confirmation' ? (
                        <>
                            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button className="btn btn-primary" onClick={onConfirm}>Confirm</button>
                        </>
                    ) : (
                        <button className="btn btn-primary" onClick={onClose}>Close</button>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['info', 'error', 'confirmation']),
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func
};

export default Modal;

// alert context provider
import { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/Modal';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alertState, setAlertState] = useState({
        isOpen: false,
        type: 'info',
        message: '',
        onConfirm: null,
        rawOnConfirm: null
    });

    const showAlert = useCallback((message, type = 'info', onConfirm = null) => {
        // handles alert display logic

        setAlertState({
            isOpen: true,
            type,
            message,
            onConfirm: onConfirm ? () => {
                onConfirm();
                closeAlert();
            } : null,
            // store raw callback for info auto-close
            rawOnConfirm: onConfirm
        });
    }, []);

    const closeAlert = useCallback(() => {
        setAlertState(prev => {
            // execute callback on close if present
            if (prev.type === 'info' && prev.rawOnConfirm) {
                prev.rawOnConfirm();
            }
            return { ...prev, isOpen: false };
        });
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Modal
                isOpen={alertState.isOpen}
                type={alertState.type}
                message={alertState.message}
                onClose={closeAlert}
                onConfirm={alertState.onConfirm}
            />
        </AlertContext.Provider>
    );
};

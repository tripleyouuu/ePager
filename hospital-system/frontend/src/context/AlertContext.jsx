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
        // If type is 'info' and onConfirm is passed, treat it as onClose callback
        // Or strictly adhere to signature. Let's support an explicit onClose or just use onConfirm for both.
        // The user requirement implies that for 'info', the action happens on close.
        // Let's modify state to hold an onCloseCallback.

        // Actually, simpler: if type is 'info', onConfirm is essentially "on acknowledge".
        // Let's wrap closeAlert to call onConfirm if it exists and type is info.

        setAlertState({
            isOpen: true,
            type,
            message,
            onConfirm: onConfirm ? () => {
                onConfirm();
                closeAlert();
            } : null,
            // Store raw callback for info auto-close
            rawOnConfirm: onConfirm
        });
    }, []);

    const closeAlert = useCallback(() => {
        setAlertState(prev => {
            // For info alerts, if there was a callback passed (as onConfirm), execute it now on close
            // This covers both auto-close and manual close button
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

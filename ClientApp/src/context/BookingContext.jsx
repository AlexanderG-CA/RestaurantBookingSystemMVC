import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        date: "",
        time: "",
        guests: 2,
        selectedTable: null,
        customerName: "",
        customerPhone: ""
    });
    const [availableTables, setAvailableTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bookingConfirmation, setBookingConfirmation] = useState(null);

    const updateBookingData = (data) => {
        setBookingData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const resetBooking = () => {
        setCurrentStep(1);
        setBookingData({
            date: "",
            time: "",
            guests: 2,
            selectedTable: null,
            customerName: "",
            customerPhone: ""
        });
        setAvailableTables([]);
        setError(null);
        setBookingConfirmation(null);
    };

    const value = {
        currentStep,
        bookingData,
        availableTables,
        loading,
        error,
        bookingConfirmation,
        updateBookingData,
        setAvailableTables,
        setLoading,
        setError,
        setBookingConfirmation,
        nextStep,
        prevStep,
        resetBooking
    };

    return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within BookingProvider');
    }
    return context;
}


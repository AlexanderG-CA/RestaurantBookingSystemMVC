import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export function DateTimeStep() {
    const {
        bookingData,
        updateBookingData,
        setAvailableTables,
        setLoading,
        setError,
        nextStep,
        loading,
        error
    } = useBooking();

    const [localDate, setLocalDate] = useState(bookingData.date);
    const [localTime, setLocalTime] = useState(bookingData.time);
    const [localGuests, setLocalGuests] = useState(bookingData.guests);

    const today = new Date().toISOString().split('T')[0];

    const handleCheckAvailability = async () => {
        setError(null);

        if (!localDate || !localTime) {
            setError('Please select both date and time.');
            return;
        }

        setLoading(true);

        try {
            const query = new URLSearchParams({
                date: localDate,
                time: localTime,
                guests: localGuests.toString()
            });

            const response = await fetch(`/Home/GetAvailableTables?${query.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to check availability. Please try again.');
            }

            const tables = await response.json();
            const available = tables.filter(t => t.isAvailable);

            if (available.length === 0) {
                setError('No tables available for the selected time. Please try another time slot.');
                setLoading(false);
                return;
            }

            updateBookingData({
                date: localDate,
                time: localTime,
                guests: parseInt(localGuests)
            });
            setAvailableTables(available);
            setLoading(false);
            nextStep();
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Checking availability..." />;
    }

    return (
        <div className="booking-step">
            <h2 className="step-title">Select Date & Time</h2>
            <p className="step-description">Choose when you'd like to visit us</p>
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
            <div className="booking-form">
                <div className="form-group">
                    <label htmlFor="date">
                        <i className="bi bi-calendar3 me-2"></i>
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        className="form-control"
                        value={localDate}
                        min={today}
                        onChange={(e) => setLocalDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="time">
                        <i className="bi bi-clock me-2"></i>
                        Time
                    </label>
                    <input
                        type="time"
                        id="time"
                        className="form-control"
                        value={localTime}
                        onChange={(e) => setLocalTime(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="guests">
                        <i className="bi bi-people me-2"></i>
                        Number of Guests
                    </label>
                    <input
                        type="number"
                        id="guests"
                        className="form-control"
                        value={localGuests}
                        min={1}
                        max={20}
                        onChange={(e) => setLocalGuests(e.target.value)}
                    />
                </div>
                <div className="step-actions">
                    <button
                        type="button"
                        className="btn btn-primary btn-lg"
                        onClick={handleCheckAvailability}
                        disabled={!localDate || !localTime}
                    >
                        Check Availability <i className="bi bi-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

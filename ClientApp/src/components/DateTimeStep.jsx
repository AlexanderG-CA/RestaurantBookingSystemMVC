import { useBooking } from '../BookingContext.js';
import { LoadingSpinner } from './LoadingSpinner.jsx';
import { ErrorMessage } from './ErrorMessage.jsx';

const { useState } = React;

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

    // Get today's date in YYYY-MM-DD format for min attribute
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

            // Update booking data and move to next step
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
        return React.createElement(LoadingSpinner, { message: 'Checking availability...' });
    }

    return React.createElement(
        'div',
        { className: 'booking-step' },
        React.createElement('h2', { className: 'step-title' }, 'Select Date & Time'),
        React.createElement('p', { className: 'step-description' }, 'Choose when you\'d like to visit us'),
        React.createElement(ErrorMessage, { message: error, onDismiss: () => setError(null) }),
        React.createElement(
            'div',
            { className: 'booking-form' },
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('label', { htmlFor: 'date' },
                    React.createElement('i', { className: 'bi bi-calendar3 me-2' }),
                    'Date'
                ),
                React.createElement('input', {
                    type: 'date',
                    id: 'date',
                    className: 'form-control',
                    value: localDate,
                    min: today,
                    onChange: (e) => setLocalDate(e.target.value)
                })
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('label', { htmlFor: 'time' },
                    React.createElement('i', { className: 'bi bi-clock me-2' }),
                    'Time'
                ),
                React.createElement('input', {
                    type: 'time',
                    id: 'time',
                    className: 'form-control',
                    value: localTime,
                    onChange: (e) => setLocalTime(e.target.value)
                })
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('label', { htmlFor: 'guests' },
                    React.createElement('i', { className: 'bi bi-people me-2' }),
                    'Number of Guests'
                ),
                React.createElement('input', {
                    type: 'number',
                    id: 'guests',
                    className: 'form-control',
                    value: localGuests,
                    min: 1,
                    max: 20,
                    onChange: (e) => setLocalGuests(e.target.value)
                })
            ),
            React.createElement(
                'div',
                { className: 'step-actions' },
                React.createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'btn btn-primary btn-lg',
                        onClick: handleCheckAvailability,
                        disabled: !localDate || !localTime
                    },
                    'Check Availability ',
                    React.createElement('i', { className: 'bi bi-arrow-right' })
                )
            )
        )
    );
}
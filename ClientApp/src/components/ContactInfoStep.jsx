import { useBooking } from '../BookingContext.js';
import { LoadingSpinner } from './LoadingSpinner.jsx';
import { ErrorMessage } from './ErrorMessage.jsx';

const { useState } = React;

export function ContactInfoStep() {
    const {
        bookingData,
        updateBookingData,
        setLoading,
        setError,
        setBookingConfirmation,
        nextStep,
        prevStep,
        loading,
        error
    } = useBooking();

    const [localName, setLocalName] = useState(bookingData.customerName);
    const [localPhone, setLocalPhone] = useState(bookingData.customerPhone);

    const validatePhone = (phone) => {
        // Basic phone validation - accepts various formats
        const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!localName.trim()) {
            setError('Please enter your name.');
            return;
        }

        if (!localPhone.trim()) {
            setError('Please enter your phone number.');
            return;
        }

        if (!validatePhone(localPhone)) {
            setError('Please enter a valid phone number.');
            return;
        }

        setLoading(true);

        try {
            // Prepare booking request
            const bookingRequest = {
                bookingDate: bookingData.date,
                startTime: bookingData.time + ':00', // Add seconds
                numberOfGuests: bookingData.guests,
                tableId: bookingData.selectedTable.id,
                customerName: localName.trim(),
                customerPhone: localPhone.trim()
            };

            // Since the API requires authentication, we'll call the MVC proxy endpoint
            const response = await fetch('/Home/CreateBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingRequest)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to create booking. Please try again.');
            }

            // Update booking data and set confirmation
            updateBookingData({
                customerName: localName.trim(),
                customerPhone: localPhone.trim()
            });

            setBookingConfirmation({
                date: bookingData.date,
                time: bookingData.time,
                guests: bookingData.guests,
                table: bookingData.selectedTable,
                customerName: localName.trim(),
                customerPhone: localPhone.trim()
            });

            setLoading(false);
            nextStep();
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return React.createElement(LoadingSpinner, { message: 'Creating your booking...' });
    }

    return React.createElement(
        'div',
        { className: 'booking-step' },
        React.createElement('h2', { className: 'step-title' }, 'Your Contact Information'),
        React.createElement('p', { className: 'step-description' }, 'We\'ll use this to confirm your booking'),
        React.createElement(ErrorMessage, { message: error, onDismiss: () => setError(null) }),
        React.createElement(
            'form',
            { onSubmit: handleSubmit, className: 'booking-form' },
            React.createElement(
                'div',
                { className: 'booking-summary-card mb-4' },
                React.createElement('h5', { className: 'mb-3' }, 'Booking Summary'),
                React.createElement(
                    'div',
                    { className: 'summary-item' },
                    React.createElement('i', { className: 'bi bi-calendar3 me-2' }),
                    React.createElement('strong', null, 'Date: '),
                    new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                ),
                React.createElement(
                    'div',
                    { className: 'summary-item' },
                    React.createElement('i', { className: 'bi bi-clock me-2' }),
                    React.createElement('strong', null, 'Time: '),
                    bookingData.time
                ),
                React.createElement(
                    'div',
                    { className: 'summary-item' },
                    React.createElement('i', { className: 'bi bi-people me-2' }),
                    React.createElement('strong', null, 'Guests: '),
                    bookingData.guests
                ),
                React.createElement(
                    'div',
                    { className: 'summary-item' },
                    React.createElement('i', { className: 'bi bi-square me-2' }),
                    React.createElement('strong', null, 'Table: '),
                    `Table ${bookingData.selectedTable.tableNumber} (${bookingData.selectedTable.capacity} seats)`
                )
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('label', { htmlFor: 'name' },
                    React.createElement('i', { className: 'bi bi-person me-2' }),
                    'Full Name *'
                ),
                React.createElement('input', {
                    type: 'text',
                    id: 'name',
                    className: 'form-control',
                    value: localName,
                    onChange: (e) => setLocalName(e.target.value),
                    placeholder: 'John Doe',
                    required: true
                })
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('label', { htmlFor: 'phone' },
                    React.createElement('i', { className: 'bi bi-telephone me-2' }),
                    'Phone Number *'
                ),
                React.createElement('input', {
                    type: 'tel',
                    id: 'phone',
                    className: 'form-control',
                    value: localPhone,
                    onChange: (e) => setLocalPhone(e.target.value),
                    placeholder: '+46 70 123 45 67',
                    required: true
                }),
                React.createElement('small', { className: 'form-text text-muted' }, 'We\'ll use this to confirm your reservation')
            ),
            React.createElement(
                'div',
                { className: 'step-actions' },
                React.createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'btn btn-secondary',
                        onClick: prevStep
                    },
                    React.createElement('i', { className: 'bi bi-arrow-left me-2' }),
                    'Back'
                ),
                React.createElement(
                    'button',
                    {
                        type: 'submit',
                        className: 'btn btn-primary btn-lg',
                        disabled: !localName.trim() || !localPhone.trim()
                    },
                    'Complete Booking ',
                    React.createElement('i', { className: 'bi bi-check-circle' })
                )
            )
        )
    );
}
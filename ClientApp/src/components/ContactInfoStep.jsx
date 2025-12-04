import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { ErrorMessage } from './ErrorMessage';

export function ContactInfoStep() {
    const {
        bookingData,
        updateBookingData,
        setBookingConfirmation,
        nextStep,
        prevStep,
        error,
        setError
    } = useBooking();

    const [localName, setLocalName] = useState(bookingData.customerName);
    const [localPhone, setLocalPhone] = useState(bookingData.customerPhone);

    const validatePhone = (phone) => {
        const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

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

        // Store contact info and show confirmation
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

        nextStep();
    };

    return (
        <div className="booking-step">
            <h2 className="step-title">Your Contact Information</h2>
            <p className="step-description">We'll use this to confirm your booking</p>
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
            <form onSubmit={handleSubmit} className="booking-form">
                <div className="booking-summary-card mb-4">
                    <h5 className="mb-3">Booking Summary</h5>
                    <div className="summary-item">
                        <i className="bi bi-calendar3 me-2"></i>
                        <strong>Date: </strong>
                        {new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="summary-item">
                        <i className="bi bi-clock me-2"></i>
                        <strong>Time: </strong>
                        {bookingData.time}
                    </div>
                    <div className="summary-item">
                        <i className="bi bi-people me-2"></i>
                        <strong>Guests: </strong>
                        {bookingData.guests}
                    </div>
                    <div className="summary-item">
                        <i className="bi bi-square me-2"></i>
                        <strong>Table: </strong>
                        Table {bookingData.selectedTable.tableNumber} ({bookingData.selectedTable.capacity} seats)
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="name">
                        <i className="bi bi-person me-2"></i>
                        Full Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={localName}
                        onChange={(e) => setLocalName(e.target.value)}
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">
                        <i className="bi bi-telephone me-2"></i>
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        className="form-control"
                        value={localPhone}
                        onChange={(e) => setLocalPhone(e.target.value)}
                        placeholder="+46 70 123 45 67"
                        required
                    />
                    <small className="form-text text-muted">We'll use this to confirm your reservation</small>
                </div>
                <div className="step-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={prevStep}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={!localName.trim() || !localPhone.trim()}
                    >
                        Review Booking <i className="bi bi-arrow-right"></i>
                    </button>
                </div>
            </form>
        </div>
    );
}

import { useBooking } from '../context/BookingContext';

export function ConfirmationStep() {
    const { bookingConfirmation, resetBooking } = useBooking();

    if (!bookingConfirmation) {
        return (
            <div className="booking-step">
                <p>No booking confirmation available.</p>
            </div>
        );
    }

    const handleNewBooking = () => {
        resetBooking();
    };

    return (
        <div className="booking-step confirmation-step">
            <div className="success-animation">
                <div className="success-checkmark">
                    <i className="bi bi-check-circle-fill"></i>
                </div>
            </div>
            <h2 className="step-title text-center">Table Available!</h2>
            <p className="step-description text-center">
                Great news! Your table is available at Tumba Bistro
            </p>
            <div className="confirmation-card">
                <h4 className="mb-4">Availability Details</h4>
                <div className="confirmation-details">
                    <div className="detail-row">
                        <div className="detail-label">
                            <i className="bi bi-person-fill me-2"></i>
                            Name
                        </div>
                        <div className="detail-value">{bookingConfirmation.customerName}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">
                            <i className="bi bi-telephone-fill me-2"></i>
                            Phone
                        </div>
                        <div className="detail-value">{bookingConfirmation.customerPhone}</div>
                    </div>
                    <div className="detail-divider"></div>
                    <div className="detail-row">
                        <div className="detail-label">
                            <i className="bi bi-calendar3 me-2"></i>
                            Date
                        </div>
                        <div className="detail-value">
                            {new Date(bookingConfirmation.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">
                            <i className="bi bi-clock-fill me-2"></i>
                            Time
                        </div>
                        <div className="detail-value">{bookingConfirmation.time}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">
                            <i className="bi bi-people-fill me-2"></i>
                            Guests
                        </div>
                        <div className="detail-value">
                            {bookingConfirmation.guests} {bookingConfirmation.guests === 1 ? 'guest' : 'guests'}
                        </div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">
                            <i className="bi bi-square-fill me-2"></i>
                            Table
                        </div>
                        <div className="detail-value">
                            Table {bookingConfirmation.table.tableNumber}
                        </div>
                    </div>
                </div>
            </div>
            <div className="confirmation-info">
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    To complete your booking, please contact us at +46 8 530 680 00 or visit the restaurant. This is a table availability check only - no booking has been created yet.
                </div>
            </div>
            <div className="confirmation-actions">
                <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleNewBooking}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Check Another Time
                </button>
                <a href="/" className="btn btn-outline-secondary btn-lg">
                    <i className="bi bi-house me-2"></i>
                    Back to Home
                </a>
            </div>
        </div>
    );
}

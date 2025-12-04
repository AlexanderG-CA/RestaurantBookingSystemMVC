import { useBooking } from '../context/BookingContext';

export function TableSelectionStep() {
    const {
        bookingData,
        availableTables,
        updateBookingData,
        nextStep,
        prevStep
    } = useBooking();

    const handleTableSelect = (table) => {
        updateBookingData({ selectedTable: table });
        nextStep();
    };

    return (
        <div className="booking-step">
            <h2 className="step-title">Select Your Table</h2>
            <p className="step-description">
                Available tables for {bookingData.guests} {bookingData.guests === 1 ? 'guest' : 'guests'} on {new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {bookingData.time}
            </p>
            <div className="tables-grid">
                {availableTables.map(table => (
                    <div
                        key={table.id}
                        className="table-card"
                        onClick={() => handleTableSelect(table)}
                    >
                        <div className="table-icon">
                            <i className="bi bi-square"></i>
                        </div>
                        <div className="table-number">Table {table.tableNumber}</div>
                        <div className="table-capacity">
                            <i className="bi bi-people me-1"></i>
                            {table.capacity} seats
                        </div>
                        <div className="table-status">
                            <i className="bi bi-check-circle me-1"></i>
                            Available
                        </div>
                        <button className="btn btn-outline-primary btn-sm">
                            Select Table
                        </button>
                    </div>
                ))}
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
            </div>
        </div>
    );
}

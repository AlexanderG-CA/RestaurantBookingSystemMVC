const { useState } = React;

function BookingApp() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [guests, setGuests] = useState(2);
    const [availableTables, setAvailableTables] = useState([]);
    const [status, setStatus] = useState(null);

    async function checkAvailability() {
        setStatus(null);
        if (!date || !time) {
            setStatus({ type: "error", message: "Please select a date and time." });
            return;
        }
        const query = new URLSearchParams({ date, time, guests });
        const response = await fetch(`/Home/GetAvailableTables?${query.toString()}`);
        if (!response.ok) {
            setStatus({ type: "error", message: "Failed to check availability." });
            return;
        }
        const tables = await response.json();
        const available = tables.filter(t => t.isAvailable);
        setAvailableTables(available);

        if (available.length === 0) {
            setStatus({ type: "warning", message: "No tables available for the selected time. Please try another time slot." });
        }
    }

    return (
        <div className="booking-form-container">
            {status && (
                <div className={`booking-alert booking-alert-${status.type}`}>
                    {status.message}
                </div>
            )}

            <div className="booking-search-form">
                <div className="booking-input-group">
                    <label>Date</label>
                    <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="booking-input-group">
                    <label>Time</label>
                    <input type="time" className="form-control" value={time} onChange={e => setTime(e.target.value)} />
                </div>
                <div className="booking-input-group">
                    <label>Guests</label>
                    <input type="number" min="1" className="form-control" value={guests} onChange={e => setGuests(e.target.value)} />
                </div>
                <div className="booking-input-group">
                    <button className="btn btn-primary booking-check-btn" onClick={checkAvailability}>
                        Check Availability
                    </button>
                </div>
            </div>

            {availableTables.length > 0 && (
                <div className="booking-results">
                    <h2 className="booking-results-title">
                        <span className="booking-success-icon">✓</span>
                        Available Tables
                    </h2>

                    <div className="booking-tables-grid">
                        {availableTables.map(t => (
                            <div key={t.id} className="booking-table-card">
                                <div className="booking-table-icon">TABLE</div>
                                <div className="booking-table-number">Table {t.tableNumber}</div>
                                <div className="booking-table-capacity">{t.capacity} seats</div>
                                <div className="booking-table-status">Available</div>
                            </div>
                        ))}
                    </div>

                    <div className="booking-contact-card">
                        <h3 className="booking-contact-title">Complete Your Booking</h3>
                        <p className="booking-contact-subtitle">To reserve your table, please contact us directly:</p>

                        <div className="booking-contact-methods">
                            <div className="booking-contact-method">
                                <div className="booking-contact-icon">PHONE</div>
                                <div className="booking-contact-label">Call Us</div>
                                <a href="tel:+46812345678" className="booking-contact-link">+46 8 123 456 78</a>
                            </div>
                            <div className="booking-contact-method">
                                <div className="booking-contact-icon">EMAIL</div>
                                <div className="booking-contact-label">Email Us</div>
                                <a href="mailto:reservations@tumbabistro.se" className="booking-contact-link">reservations@tumbabistro.se</a>
                            </div>
                        </div>

                        <p className="booking-contact-note">
                            Please mention your preferred table number, date, and time when contacting us.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("booking-app")).render(<BookingApp />);
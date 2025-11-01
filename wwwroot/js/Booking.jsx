const { useState } = React;

function BookingApp() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [guests, setGuests] = useState(2);
    const [availableTables, setAvailableTables] = useState([]);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
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
        setAvailableTables(tables.filter(t => t.isAvailable));
        setSelectedTableId(null);
    }

    async function createBooking() {
        if (!selectedTableId) {
            setStatus({ type: "error", message: "Please select a table." });
            return;
        }
        if (!customerName || !customerPhone) {
            setStatus({ type: "error", message: "Enter your name and phone number." });
            return;
        }
        const payload = {
            bookingDate: date,
            startTime: time,
            numberOfGuests: parseInt(guests, 10),
            tableId: parseInt(selectedTableId, 10),
            customerName,
            customerPhone
        };
        const response = await fetch("/Home/CreateBooking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        if (response.status === 401) {
            setStatus({ type: "error", message: "Please log in as an administrator before booking." });
            return;
        }
        if (!response.ok) {
            const error = await response.text();
            setStatus({ type: "error", message: error });
            return;
        }
        setStatus({ type: "success", message: "Booking created successfully!" });
        setAvailableTables([]);
        setSelectedTableId(null);
        setCustomerName("");
        setCustomerPhone("");
    }

    return (
        <div className="booking-form">
            {status && (
                <div className={status.type === "error" ? "alert alert-danger" : "alert alert-success"}>
                    {status.message}
                </div>
            )}
            <div className="row mb-3">
                <div className="col">
                    <label>Date</label>
                    <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="col">
                    <label>Time</label>
                    <input type="time" className="form-control" value={time} onChange={e => setTime(e.target.value)} />
                </div>
                <div className="col">
                    <label>Guests</label>
                    <input type="number" min="1" className="form-control" value={guests} onChange={e => setGuests(e.target.value)} />
                </div>
                <div className="col d-flex align-items-end">
                    <button className="btn btn-primary" onClick={checkAvailability}>Check availability</button>
                </div>
            </div>

            {availableTables.length > 0 && (
                <div className="mb-3">
                    <h5>Select a table:</h5>
                    {availableTables.map(t => (
                        <div key={t.id} className="form-check">
                            <input className="form-check-input" type="radio" name="table" value={t.id}
                                onChange={() => setSelectedTableId(t.id)}
                                checked={selectedTableId === t.id} />
                            <label className="form-check-label">
                                Table {t.tableNumber} (Seats {t.capacity})
                            </label>
                        </div>
                    ))}
                </div>
            )}

            {availableTables.length > 0 && (
                <div className="mb-3">
                    <h5>Your details:</h5>
                    <div className="row">
                        <div className="col">
                            <label>Name</label>
                            <input type="text" className="form-control" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                        </div>
                        <div className="col">
                            <label>Phone</label>
                            <input type="text" className="form-control" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                        </div>
                        <div className="col d-flex align-items-end">
                            <button className="btn btn-success" onClick={createBooking}>Book table</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("booking-app")).render(<BookingApp />);

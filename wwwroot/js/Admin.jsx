const { useState } = React;

function AdminApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);

    async function login(e) {
        e.preventDefault();
        setError(null);
        const response = await fetch("/Admin/LoginApi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            setIsAuthenticated(true);
            loadBookings();
        } else {
            setError("Invalid credentials");
        }
    }

    async function loadBookings() {
        const response = await fetch("/Admin/BookingsJson");
        if (response.status === 401) {
            setIsAuthenticated(false);
            return;
        }
        const data = await response.json();
        setBookings(data);
    }

    async function deleteBooking(id) {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;
        const response = await fetch(`/Admin/DeleteBookingJson?id=${id}`, { method: "DELETE" });
        if (response.ok) {
            loadBookings();
        } else {
            alert("Failed to delete booking");
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="login-form">
                <h4>Admin Login</h4>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={login}>
                    <div className="mb-3">
                        <label>Username</label>
                        <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" type="submit">Login</button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <h4>Bookings</h4>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Guests</th>
                        <th>Customer</th>
                        <th>Table</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(b => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                            <td>{b.startTime}</td>
                            <td>{b.numberOfGuests}</td>
                            <td>{b.customer?.name}</td>
                            <td>{b.table?.tableNumber}</td>
                            <td>
                                <button className="btn btn-sm btn-danger" onClick={() => deleteBooking(b.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("admin-app")).render(<AdminApp />);

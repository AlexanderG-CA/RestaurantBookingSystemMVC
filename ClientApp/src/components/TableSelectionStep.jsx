import { useBooking } from '../BookingContext.js';

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

    return React.createElement(
        'div',
        { className: 'booking-step' },
        React.createElement('h2', { className: 'step-title' }, 'Select Your Table'),
        React.createElement(
            'p',
            { className: 'step-description' },
            `Available tables for ${bookingData.guests} ${bookingData.guests === 1 ? 'guest' : 'guests'} on ${new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${bookingData.time}`
        ),
        React.createElement(
            'div',
            { className: 'tables-grid' },
            availableTables.map(table =>
                React.createElement(
                    'div',
                    {
                        key: table.id,
                        className: 'table-card',
                        onClick: () => handleTableSelect(table)
                    },
                    React.createElement(
                        'div',
                        { className: 'table-icon' },
                        React.createElement('i', { className: 'bi bi-square' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'table-number' },
                        `Table ${table.tableNumber}`
                    ),
                    React.createElement(
                        'div',
                        { className: 'table-capacity' },
                        React.createElement('i', { className: 'bi bi-people me-1' }),
                        `${table.capacity} seats`
                    ),
                    React.createElement(
                        'div',
                        { className: 'table-status' },
                        React.createElement('i', { className: 'bi bi-check-circle me-1' }),
                        'Available'
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn btn-outline-primary btn-sm' },
                        'Select Table'
                    )
                )
            )
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
            )
        )
    );
}
import { useBooking } from '../BookingContext.js';

export function ConfirmationStep() {
    const { bookingConfirmation, resetBooking } = useBooking();

    if (!bookingConfirmation) {
        return React.createElement(
            'div',
            { className: 'booking-step' },
            React.createElement('p', null, 'No booking confirmation available.')
        );
    }

    const handleNewBooking = () => {
        resetBooking();
    };

    return React.createElement(
        'div',
        { className: 'booking-step confirmation-step' },
        React.createElement(
            'div',
            { className: 'success-animation' },
            React.createElement(
                'div',
                { className: 'success-checkmark' },
                React.createElement('i', { className: 'bi bi-check-circle-fill' })
            )
        ),
        React.createElement('h2', { className: 'step-title text-center' }, 'Booking Confirmed!'),
        React.createElement(
            'p',
            { className: 'step-description text-center' },
            'Thank you for your reservation at Tumba Bistro'
        ),
        React.createElement(
            'div',
            { className: 'confirmation-card' },
            React.createElement('h4', { className: 'mb-4' }, 'Booking Details'),
            React.createElement(
                'div',
                { className: 'confirmation-details' },
                React.createElement(
                    'div',
                    { className: 'detail-row' },
                    React.createElement(
                        'div',
                        { className: 'detail-label' },
                        React.createElement('i', { className: 'bi bi-person-fill me-2' }),
                        'Name'
                    ),
                    React.createElement('div', { className: 'detail-value' }, bookingConfirmation.customerName)
                ),
                React.createElement(
                    'div',
                    { className: 'detail-row' },
                    React.createElement(
                        'div',
                        { className: 'detail-label' },
                        React.createElement('i', { className: 'bi bi-telephone-fill me-2' }),
                        'Phone'
                    ),
                    React.createElement('div', { className: 'detail-value' }, bookingConfirmation.customerPhone)
                ),
                React.createElement('div', { className: 'detail-divider' }),
                React.createElement(
                    'div',
                    { className: 'detail-row' },
                    React.createElement(
                        'div',
                        { className: 'detail-label' },
                        React.createElement('i', { className: 'bi bi-calendar3 me-2' }),
                        'Date'
                    ),
                    React.createElement(
                        'div',
                        { className: 'detail-value' },
                        new Date(bookingConfirmation.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'detail-row' },
                    React.createElement(
                        'div',
                        { className: 'detail-label' },
                        React.createElement('i', { className: 'bi bi-clock-fill me-2' }),
                        'Time'
                    ),
                    React.createElement('div', { className: 'detail-value' }, bookingConfirmation.time)
                ),
                React.createElement(
                    'div',
                    { className: 'detail-row' },
                    React.createElement(
                        'div',
                        { className: 'detail-label' },
                        React.createElement('i', { className: 'bi bi-people-fill me-2' }),
                        'Guests'
                    ),
                    React.createElement(
                        'div',
                        { className: 'detail-value' },
                        bookingConfirmation.guests,
                        ' ',
                        bookingConfirmation.guests === 1 ? 'guest' : 'guests'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'detail-row' },
                    React.createElement(
                        'div',
                        { className: 'detail-label' },
                        React.createElement('i', { className: 'bi bi-square-fill me-2' }),
                        'Table'
                    ),
                    React.createElement(
                        'div',
                        { className: 'detail-value' },
                        `Table ${bookingConfirmation.table.tableNumber}`
                    )
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'confirmation-info' },
            React.createElement(
                'div',
                { className: 'alert alert-info' },
                React.createElement('i', { className: 'bi bi-info-circle me-2' }),
                'You will receive a confirmation call shortly. Please arrive 5-10 minutes before your reservation time.'
            )
        ),
        React.createElement(
            'div',
            { className: 'confirmation-actions' },
            React.createElement(
                'button',
                {
                    type: 'button',
                    className: 'btn btn-primary btn-lg',
                    onClick: handleNewBooking
                },
                React.createElement('i', { className: 'bi bi-plus-circle me-2' }),
                'Make Another Booking'
            ),
            React.createElement(
                'a',
                {
                    href: '/',
                    className: 'btn btn-outline-secondary btn-lg'
                },
                React.createElement('i', { className: 'bi bi-house me-2' }),
                'Back to Home'
            )
        )
    );
}
export function ErrorMessage({ message, onDismiss }) {
    if (!message) return null;

    return React.createElement(
        'div',
        { className: 'alert alert-danger alert-dismissible fade show', role: 'alert' },
        React.createElement('i', { className: 'bi bi-exclamation-triangle me-2' }),
        message,
        onDismiss && React.createElement(
            'button',
            {
                type: 'button',
                className: 'btn-close',
                onClick: onDismiss,
                'aria-label': 'Close'
            }
        )
    );
}
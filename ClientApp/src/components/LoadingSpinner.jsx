export function LoadingSpinner({ message = 'Loading...' }) {
    return React.createElement(
        'div',
        { className: 'loading-spinner-container' },
        React.createElement('div', { className: 'spinner-border text-primary', role: 'status' }),
        React.createElement('p', { className: 'loading-message' }, message)
    );
}
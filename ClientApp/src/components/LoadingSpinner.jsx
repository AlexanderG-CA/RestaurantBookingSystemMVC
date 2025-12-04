export function LoadingSpinner({ message = 'Loading...' }) {
    return (
        <div className="loading-spinner-container">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="loading-message">{message}</p>
        </div>
    );
}

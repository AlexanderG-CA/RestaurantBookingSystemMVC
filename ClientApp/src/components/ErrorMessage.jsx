export function ErrorMessage({ message, onDismiss }) {
    if (!message) return null;

    return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {message}
            {onDismiss && (
                <button
                    type="button"
                    className="btn-close"
                    onClick={onDismiss}
                    aria-label="Close"
                ></button>
            )}
        </div>
    );
}

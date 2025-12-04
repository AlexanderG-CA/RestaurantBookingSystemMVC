import { useBooking } from '../context/BookingContext';

export function StepIndicator() {
    const { currentStep } = useBooking();

    const steps = [
        { number: 1, label: 'Date & Time' },
        { number: 2, label: 'Select Table' },
        { number: 3, label: 'Your Info' },
        { number: 4, label: 'Confirmation' }
    ];

    return (
        <div className="step-indicator-container">
            <div className="step-indicator">
                {steps.map((step, index) => (
                    <div key={step.number}>
                        <div className={`step-item ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
                            <div className="step-circle">
                                {currentStep > step.number ? (
                                    <i className="bi bi-check"></i>
                                ) : (
                                    step.number
                                )}
                            </div>
                            <div className="step-label">{step.label}</div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`step-line ${currentStep > step.number ? 'completed' : ''}`}></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

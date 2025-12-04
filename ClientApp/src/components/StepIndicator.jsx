import { useBooking } from '../BookingContext.js';

export function StepIndicator() {
    const { currentStep } = useBooking();

    const steps = [
        { number: 1, label: 'Date & Time' },
        { number: 2, label: 'Select Table' },
        { number: 3, label: 'Your Info' },
        { number: 4, label: 'Confirmation' }
    ];

    return React.createElement(
        'div',
        { className: 'step-indicator-container' },
        React.createElement(
            'div',
            { className: 'step-indicator' },
            steps.map((step, index) =>
                React.createElement(
                    React.Fragment,
                    { key: step.number },
                    React.createElement(
                        'div',
                        {
                            className: `step-item ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`
                        },
                        React.createElement(
                            'div',
                            { className: 'step-circle' },
                            currentStep > step.number
                                ? React.createElement('i', { className: 'bi bi-check' })
                                : step.number
                        ),
                        React.createElement(
                            'div',
                            { className: 'step-label' },
                            step.label
                        )
                    ),
                    index < steps.length - 1 &&
                    React.createElement(
                        'div',
                        {
                            className: `step-line ${currentStep > step.number ? 'completed' : ''}`
                        }
                    )
                )
            )
        )
    );
}
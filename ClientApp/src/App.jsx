import { BookingProvider, useBooking } from './context/BookingContext';
import { StepIndicator } from './components/StepIndicator';
import { DateTimeStep } from './components/DateTimeStep';
import { TableSelectionStep } from './components/TableSelectionStep';
import { ContactInfoStep } from './components/ContactInfoStep';
import { ConfirmationStep } from './components/ConfirmationStep';
import './styles/booking.css';

function BookingContent() {
    const { currentStep } = useBooking();

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <DateTimeStep />;
            case 2:
                return <TableSelectionStep />;
            case 3:
                return <ContactInfoStep />;
            case 4:
                return <ConfirmationStep />;
            default:
                return <DateTimeStep />;
        }
    };

    return (
        <div className="booking-app-container">
            <div className="booking-header">
                <h1 className="booking-title">Book Your Table</h1>
                <p className="booking-subtitle">Reserve your spot at Tumba Bistro</p>
            </div>
            {currentStep < 4 && <StepIndicator />}
            <div className="booking-content">
                {renderStep()}
            </div>
        </div>
    );
}

function App() {
    return (
        <BookingProvider>
            <BookingContent />
        </BookingProvider>
    );
}

export default App;

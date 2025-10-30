namespace RestaurantWebsite.Models
{
    /// <summary>
    /// Represents a reservation booking.
    /// </summary>
    public class Booking
    {
        public int Id { get; set; }
        public DateTime BookingDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public int NumberOfGuests { get; set; }
        public int CustomerId { get; set; }
        public int TableId { get; set; }
        public Customer? Customer { get; set; }
        public Table? Table { get; set; }
    }
}
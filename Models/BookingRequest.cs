namespace RestaurantWebsite.Models
{
    /// <summary>
    /// Request object used when creating a booking via the API.
    /// </summary>
    public class BookingRequest
    {
        public DateTime BookingDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public int NumberOfGuests { get; set; }
        public int TableId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
    }
}
namespace RestaurantWebsite.Models
{
    /// <summary>
    /// Represents a customer record returned from the backend.
    /// </summary>
    public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
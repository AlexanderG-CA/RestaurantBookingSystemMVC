namespace RestaurantWebsite.Models
{
    /// <summary>
    /// Represents a dining table in the restaurant.
    /// </summary>
    public class Table
    {
        public int Id { get; set; }
        public int TableNumber { get; set; }
        public int Capacity { get; set; }
    }
}
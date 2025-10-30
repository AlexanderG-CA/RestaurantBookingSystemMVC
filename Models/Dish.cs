namespace RestaurantWebsite.Models
{
    /// <summary>
    /// Represents a dish returned from the backend API.
    /// </summary>
    public class Dish
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsPopular { get; set; }
        public string? ImageUrl { get; set; }
    }
}
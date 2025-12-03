using System.ComponentModel.DataAnnotations;

namespace RestaurantWebsite.Models
{
    public class Dish
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Dish name is required")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, 10000, ErrorMessage = "Price must be between 0.01 and 10000")]
        public decimal Price { get; set; }

        public string Description { get; set; } = string.Empty;

        public bool IsPopular { get; set; }

        public string? ImageUrl { get; set; }
    }
}
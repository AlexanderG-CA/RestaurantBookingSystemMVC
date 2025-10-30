using Microsoft.AspNetCore.Mvc;
using RestaurantWebsite.Services;
using RestaurantWebsite.Models;

namespace RestaurantWebsite.Controllers
{
    /// <summary>
    /// Controller for displaying the full menu to public users.
    /// </summary>
    public class MenuController : Controller
    {
        private readonly ApiService _apiService;
        public MenuController(ApiService apiService)
        {
            _apiService = apiService;
        }

        /// <summary>
        /// Displays all dishes. Supports optional filtering by name and price range.
        /// </summary>
        public async Task<IActionResult> Index(string? search, decimal? minPrice, decimal? maxPrice)
        {
            var dishes = await _apiService.GetDishesAsync() ?? new List<Dish>();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLowerInvariant();
                dishes = dishes.Where(d => d.Name.ToLowerInvariant().Contains(term) || d.Description.ToLowerInvariant().Contains(term)).ToList();
            }
            if (minPrice.HasValue)
            {
                dishes = dishes.Where(d => d.Price >= minPrice.Value).ToList();
            }
            if (maxPrice.HasValue)
            {
                dishes = dishes.Where(d => d.Price <= maxPrice.Value).ToList();
            }
            ViewBag.Search = search;
            ViewBag.MinPrice = minPrice;
            ViewBag.MaxPrice = maxPrice;
            return View(dishes);
        }
    }
}
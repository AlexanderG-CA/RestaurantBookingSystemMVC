using Microsoft.AspNetCore.Mvc;
using RestaurantWebsite.Services;
using RestaurantWebsite.Models;

namespace RestaurantWebsite.Controllers
{
    /// <summary>
    /// Public controller responsible for the home/landing page.
    /// </summary>
    public class HomeController : Controller
    {
        private readonly ApiService _apiService;
        public HomeController(ApiService apiService)
        {
            _apiService = apiService;
        }

        /// <summary>
        /// Landing page. Displays an introduction and a few of the most popular dishes.
        /// </summary>
        public async Task<IActionResult> Index()
        {
            var popularDishes = await _apiService.GetPopularDishesAsync();
            return View(popularDishes ?? new List<Dish>());
        }

        /// <summary>
        /// A contact or booking info page (optional). Currently just returns static view.
        /// </summary>
        public IActionResult Contact()
        {
            return View();
        }
    }
}
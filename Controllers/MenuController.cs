using Microsoft.AspNetCore.Mvc;
using RestaurantWebsite.Services;
using RestaurantWebsite.Models;

namespace RestaurantWebsite.Controllers
{
    public class MenuController : Controller
    {
        private readonly ApiService _apiService;
        public MenuController(ApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<IActionResult> Index()
        {
            var dishes = await _apiService.GetDishesAsync() ?? new List<Dish>();
            return View(dishes);
        }
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantWebsite.Models;
using RestaurantWebsite.Services;

namespace RestaurantWebsite.Controllers
{
    /// <summary>
    /// Provides an administrator interface for managing dishes, bookings and tables.
    /// All actions in this controller require authentication.
    /// </summary>
    [Authorize]
    public class AdminController : Controller
    {
        private readonly ApiService _apiService;
        public AdminController(ApiService apiService)
        {
            _apiService = apiService;
        }

        private string? GetToken() => HttpContext.Session.GetString("JwtToken");

        public IActionResult Index()
        {
            // Dashboard could display summary statistics in the future
            return View();
        }

        #region Dish Management
        public async Task<IActionResult> Dishes()
        {
            var dishes = await _apiService.GetDishesAsync() ?? new List<Dish>();
            return View(dishes);
        }

        public IActionResult CreateDish()
        {
            return View(new Dish());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateDish(Dish model)
        {
            var token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();
            await _apiService.CreateDishAsync(model, token);
            return RedirectToAction(nameof(Dishes));
        }

        public async Task<IActionResult> EditDish(int id)
        {
            var dish = await _apiService.GetDishAsync(id);
            if (dish == null) return NotFound();
            return View(dish);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditDish(Dish model)
        {
            var token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();
            await _apiService.UpdateDishAsync(model, token);
            return RedirectToAction(nameof(Dishes));
        }

        public async Task<IActionResult> DeleteDish(int id)
        {
            var token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();
            await _apiService.DeleteDishAsync(id, token);
            return RedirectToAction(nameof(Dishes));
        }
        #endregion

        #region Bookings Management
        public async Task<IActionResult> Bookings()
        {
            var token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();
            var bookings = await _apiService.GetBookingsDetailedAsync(token) ?? new List<Booking>();
            return View(bookings);
        }

        public async Task<IActionResult> DeleteBooking(int id)
        {
            var token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();
            await _apiService.DeleteBookingAsync(id, token);
            return RedirectToAction(nameof(Bookings));
        }
        #endregion

        #region Table Management
        public async Task<IActionResult> Tables()
        {
            var token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();
            var tables = await _apiService.GetTablesAsync(token) ?? new List<Table>();
            return View(tables);
        }

        public IActionResult CreateTable()
        {
            return View(new Table());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateTable(Table model)
        {
            var token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();
            await _apiService.CreateTableAsync(model, token);
            return RedirectToAction(nameof(Tables));
        }

        public async Task<IActionResult> EditTable(int id)
        {
            var token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();
            var table = await _apiService.GetTableAsync(id, token);
            if (table == null) return NotFound();
            return View(table);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditTable(Table model)
        {
            var token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();
            await _apiService.UpdateTableAsync(model, token);
            return RedirectToAction(nameof(Tables));
        }

        public async Task<IActionResult> DeleteTable(int id)
        {
            var token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();
            await _apiService.DeleteTableAsync(id, token);
            return RedirectToAction(nameof(Tables));
        }
        #endregion
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RestaurantWebsite.Services;
using RestaurantWebsite.Models;

namespace RestaurantWebsite.Controllers
{
    /// <summary>
    /// Public controller responsible for the home/landing page and booking functions.
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

        /// <summary>
        /// Renders a React booking page. The view contains a div with id="booking-app"
        /// and script tags to load React and the booking component.
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Booking()
        {
            return View();
        }

        /// <summary>
        /// Proxy endpoint used by the React booking form to fetch available tables.
        /// Delegates to ApiService.GetAvailableTablesAsync():contentReference[oaicite:2]{index=2}.
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAvailableTables(DateTime date, TimeSpan time, int guests)
        {
            var result = await _apiService.GetAvailableTablesAsync(date, time, guests);
            if (result == null)
                return StatusCode(500);
            return Json(result);
        }

        /// <summary>
        /// Creates a booking by posting to the backend API. Requires a JWT in session,
        /// which is stored after admin login via the AccountController.
        /// </summary>
        [HttpPost]
        [IgnoreAntiforgeryToken] // called from client-side JS
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequest request)
        {
            var token = HttpContext.Session.GetString("JwtToken");
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("You must be logged in as an administrator to create bookings.");
            }

            var success = await _apiService.CreateBookingAsync(request, token);
            if (!success)
            {
                return StatusCode(500, "Failed to create booking.");
            }

            return Ok(new { message = "Booking created successfully" });
        }
    }
}

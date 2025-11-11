using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantWebsite.Models;
using RestaurantWebsite.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace RestaurantWebsite.Controllers
{
    /// <summary>
    /// Provides an administrator interface for managing dishes, bookings and tables.
    /// All actions in this controller require authentication except those explicitly marked with AllowAnonymous.
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

        public async Task<IActionResult> EditBooking(int id)
        {
            string? token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();

            // Fetch the booking details (including Customer and Table info)
            Booking? booking = await _apiService.GetBookingAsync(id, token);
            if (booking == null)
            {
                return NotFound($"Booking ID {id} not found.");
            }

            // Fetch all tables and filter those that can accommodate the current number of guests
            var allTables = await _apiService.GetTablesAsync(token) ?? new List<Table>();
            var suitableTables = allTables.Where(t => t.Capacity >= booking.NumberOfGuests).ToList();

            // Package into a view model
            var viewModel = new EditBookingViewModel
            {
                Booking = booking,
                Tables = suitableTables
            };

            return View(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditBooking(Booking booking)
        {
            string? token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();

            if (!ModelState.IsValid)
            {
                var allTables = await _apiService.GetTablesAsync(token) ?? new List<Table>();
                var suitableTables = allTables.Where(t => t.Capacity >= booking.NumberOfGuests).ToList();
                var vm = new EditBookingViewModel { Booking = booking, Tables = suitableTables };
                return View(vm);
            }

            bool success = await _apiService.UpdateBookingAsync(booking, token);
            if (!success)
            {
                ModelState.AddModelError(string.Empty, "Updating the booking failed. Please try again.");
                var allTables = await _apiService.GetTablesAsync(token) ?? new List<Table>();
                var suitableTables = allTables.Where(t => t.Capacity >= booking.NumberOfGuests).ToList();
                var vm = new EditBookingViewModel { Booking = booking, Tables = suitableTables };
                return View(vm);
            }

            return RedirectToAction(nameof(Bookings));
        }



        // GET: Show form
        [HttpGet]
        public IActionResult CreateBooking()
        {
            return View(new BookingRequest());
        }

        // POST: Submit form
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateBooking(BookingRequest model)
        {
            var token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();

            if (!ModelState.IsValid)
                return View(model);

            var success = await _apiService.CreateBookingAsync(model, token);
            if (!success)
            {
                ModelState.AddModelError("", "Failed to create booking.");
                return View(model);
            }

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

        #region React Admin Endpoints

        /// <summary>
        /// Serves the React-based admin dashboard.
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult React()
        {
            return View();
        }

        /// <summary>
        /// Authenticates an administrator via the API and stores the JWT in session.
        /// Also issues an MVC authentication cookie.
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> LoginApi([FromBody] LoginRequest model)
        {
            var authResponse = await _apiService.LoginAsync(model);
            if (authResponse == null)
            {
                return Unauthorized();
            }

            // Save token in session
            HttpContext.Session.SetString("JwtToken", authResponse.Token);

            // Issue cookie
            var claims = new List<Claim> { new Claim(ClaimTypes.Name, model.Username) };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = authResponse.Expires.ToUniversalTime()
            };
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

            return Ok();
        }

        /// <summary>
        /// Returns bookings in JSON for the React admin dashboard.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> BookingsJson()
        {
            var token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();
            var bookings = await _apiService.GetBookingsDetailedAsync(token) ?? new List<Booking>();
            return Json(bookings);
        }

        /// <summary>
        /// Deletes a booking and returns OK for the React admin dashboard.
        /// </summary>
        [HttpDelete]
        public async Task<IActionResult> DeleteBookingJson(int id)
        {
            var token = GetToken();
            if (string.IsNullOrEmpty(token)) return Unauthorized();
            await _apiService.DeleteBookingAsync(id, token);
            return Ok();
        }

        #endregion
    }
}

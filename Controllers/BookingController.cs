using Microsoft.AspNetCore.Mvc;
using RestaurantWebsite.Models;
using RestaurantWebsite.Services;
using System.Text.Json;

namespace RestaurantWebsite.Controllers
{
    /// <summary>
    /// Public controller that allows visitors to search for available tables.
    /// This controller does not require authentication and simply exposes a
    /// form where guests can select a date, time and party size. When the
    /// form is submitted the controller queries the REST API for available
    /// tables and displays the results.
    /// </summary>
    public class BookingController : Controller
    {
        private readonly ApiService _apiService;

        public BookingController(ApiService apiService)
        {
            _apiService = apiService;
        }

        /// <summary>
        /// Displays the search form. An empty view model is used to populate
        /// the default values for the form fields.
        /// </summary>
        [HttpGet]
        public IActionResult Index()
        {
            var vm = new BookingSearchViewModel();
            return View(vm);
        }

        /// <summary>
        /// Handles form submission for booking searches. This action will call
        /// the REST API to retrieve available tables for the given date, time
        /// and number of guests. The resulting list of tables is stored on
        /// the view model and sent back to the view for display.
        /// </summary>
        /// <param name="model">The user-provided search parameters.</param>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(BookingSearchViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var result = await _apiService.GetAvailableTablesAsync(
                model.BookingDate,
                model.StartTime,
                model.NumberOfGuests,
                includeUnavailable: false);

            if (result.HasValue)
            {
                var list = new List<Table>();
                try
                {
                    // API returns an array of table objects directly
                    foreach (var el in result.Value.EnumerateArray())
                    {
                        // Only add tables that are available
                        if (el.TryGetProperty("isAvailable", out var isAvailableEl)
                            && isAvailableEl.GetBoolean())
                        {
                            var table = new Table
                            {
                                Id = el.GetProperty("id").GetInt32(),
                                TableNumber = el.GetProperty("tableNumber").GetInt32(),
                                Capacity = el.GetProperty("capacity").GetInt32()
                            };
                            list.Add(table);
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Log the error
                    Console.WriteLine($"Error parsing availability: {ex.Message}");
                    ModelState.AddModelError("", "Failed to retrieve available tables. Please try again.");
                }
                model.AvailableTables = list;
            }
            else
            {
                model.AvailableTables = new List<Table>();
                ModelState.AddModelError("", "Unable to check availability. Please try again.");
            }

            return View(model);
        }
    }
}

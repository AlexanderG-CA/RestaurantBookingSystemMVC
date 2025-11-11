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

            var result = await _apiService.GetAvailableTablesAsync(model.BookingDate, model.StartTime, model.NumberOfGuests);
            if (result.HasValue)
            {
                var list = new List<Table>();
                try
                {
                    // The API returns a JSON object. We expect a property called
                    // "availableTables" containing an array of tables. Deserialize
                    // each element into a Table instance.
                    if (result.Value.TryGetProperty("availableTables", out var tablesEl))
                    {
                        foreach (var el in tablesEl.EnumerateArray())
                        {
                            var table = JsonSerializer.Deserialize<Table>(el.GetRawText(), new JsonSerializerOptions
                            {
                                PropertyNameCaseInsensitive = true
                            });
                            if (table != null)
                            {
                                list.Add(table);
                            }
                        }
                    }
                }
                catch
                {
                    // If the API response shape changes or cannot be parsed,
                    // we simply leave the list empty. The view will handle this.
                }
                model.AvailableTables = list;
            }
            else
            {
                model.AvailableTables = new List<Table>();
            }
            return View(model);
        }
    }
}

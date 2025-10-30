using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using RestaurantWebsite.Models;

namespace RestaurantWebsite.Services
{
    /// <summary>
    /// Encapsulates calls to the backend REST API. Use this service from controllers
    /// to fetch and manipulate data. All methods are asynchronous and return null
    /// or throw on failure.
    /// </summary>
    public class ApiService
    {
        private readonly HttpClient _client;

        public ApiService(HttpClient client)
        {
            _client = client;
        }

        private static readonly JsonSerializerOptions SerializerOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        /// <summary>
        /// Retrieves all dishes from the backend API.
        /// </summary>
        public async Task<IReadOnlyList<Dish>?> GetDishesAsync()
        {
            var response = await _client.GetAsync("api/dishes");
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Dish>>(json, SerializerOptions);
        }

        /// <summary>
        /// Retrieves a single dish by its identifier.
        /// </summary>
        public async Task<Dish?> GetDishAsync(int id)
        {
            var response = await _client.GetAsync($"api/dishes/{id}");
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Dish>(json, SerializerOptions);
        }

        /// <summary>
        /// Retrieves only dishes marked as popular.
        /// </summary>
        public async Task<IReadOnlyList<Dish>?> GetPopularDishesAsync()
        {
            var dishes = await GetDishesAsync();
            return dishes?.Where(d => d.IsPopular).ToList();
        }

        /// <summary>
        /// Authenticate a user against the API and return the JWT on success.
        /// </summary>
        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("api/auth/login", content);
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<AuthResponse>(json, SerializerOptions);
        }

        /// <summary>
        /// Retrieves bookings from the API. Requires a JWT for authorization.
        /// </summary>
        public async Task<IReadOnlyList<Booking>?> GetBookingsAsync(string token)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Get, "api/bookings");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _client.SendAsync(requestMessage);
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Booking>>(json, SerializerOptions);
        }

        /// <summary>
        /// Fetches a single booking by id.
        /// </summary>
        public async Task<Booking?> GetBookingAsync(int id, string token)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Get, $"api/bookings/{id}");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _client.SendAsync(requestMessage);
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Booking>(json, SerializerOptions);
        }

        /// <summary>
        /// Creates a new dish. Requires a JWT for authorization.
        /// </summary>
        public async Task<bool> CreateDishAsync(Dish dish, string token)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "api/dishes");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            requestMessage.Content = new StringContent(JsonSerializer.Serialize(dish), Encoding.UTF8, "application/json");
            var response = await _client.SendAsync(requestMessage);
            return response.IsSuccessStatusCode;
        }

        /// <summary>
        /// Updates an existing dish. Requires a JWT.
        /// </summary>
        public async Task<bool> UpdateDishAsync(Dish dish, string token)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Put, $"api/dishes/{dish.Id}");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            requestMessage.Content = new StringContent(JsonSerializer.Serialize(dish), Encoding.UTF8, "application/json");
            var response = await _client.SendAsync(requestMessage);
            return response.IsSuccessStatusCode;
        }

        /// <summary>
        /// Deletes a dish by its identifier. Requires a JWT.
        /// </summary>
        public async Task<bool> DeleteDishAsync(int id, string token)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Delete, $"api/dishes/{id}");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _client.SendAsync(requestMessage);
            return response.IsSuccessStatusCode;
        }

        /// <summary>
        /// Retrieves a list of all tables. Requires a JWT.
        /// </summary>
        public async Task<IReadOnlyList<Table>?> GetTablesAsync(string token)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Get, "api/tables");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _client.SendAsync(requestMessage);
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Table>>(json, SerializerOptions);
        }

        /// <summary>
        /// Retrieves a single table by id (requires JWT).
        /// </summary>
        public async Task<Table?> GetTableAsync(int id, string token)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Get, $"api/tables/{id}");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _client.SendAsync(requestMessage);
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Table>(json, SerializerOptions);
        }

        /// <summary>
        /// Creates a new table. Requires a JWT.
        /// </summary>
        public async Task<bool> CreateTableAsync(Table table, string token)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "api/tables");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            requestMessage.Content = new StringContent(JsonSerializer.Serialize(table), Encoding.UTF8, "application/json");
            var response = await _client.SendAsync(requestMessage);
            return response.IsSuccessStatusCode;
        }

        /// <summary>
        /// Updates an existing table. Requires a JWT.
        /// </summary>
        public async Task<bool> UpdateTableAsync(Table table, string token)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Put, $"api/tables/{table.Id}");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            requestMessage.Content = new StringContent(JsonSerializer.Serialize(table), Encoding.UTF8, "application/json");
            var response = await _client.SendAsync(requestMessage);
            return response.IsSuccessStatusCode;
        }

        /// <summary>
        /// Deletes a table by id. Requires a JWT.
        /// </summary>
        public async Task<bool> DeleteTableAsync(int id, string token)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Delete, $"api/tables/{id}");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _client.SendAsync(requestMessage);
            return response.IsSuccessStatusCode;
        }

        /// <summary>
        /// Retrieves all bookings along with customers and tables. Requires a JWT.
        /// </summary>
        public async Task<IReadOnlyList<Booking>?> GetBookingsDetailedAsync(string token)
        {
            // The API returns bookings with related customer and table details in GetBookings.
            return await GetBookingsAsync(token);
        }

        /// <summary>
        /// Creates a booking. Requires a JWT.
        /// </summary>
        public async Task<bool> CreateBookingAsync(BookingRequest request, string token)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "api/bookings");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            requestMessage.Content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            var response = await _client.SendAsync(requestMessage);
            return response.IsSuccessStatusCode;
        }

        /// <summary>
        /// Updates a booking. Requires a JWT.
        /// </summary>
        public async Task<bool> UpdateBookingAsync(Booking booking, string token)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Put, $"api/bookings/{booking.Id}");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            requestMessage.Content = new StringContent(JsonSerializer.Serialize(booking), Encoding.UTF8, "application/json");
            var response = await _client.SendAsync(requestMessage);
            return response.IsSuccessStatusCode;
        }

        /// <summary>
        /// Deletes a booking. Requires a JWT.
        /// </summary>
        public async Task<bool> DeleteBookingAsync(int id, string token)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Delete, $"api/bookings/{id}");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _client.SendAsync(requestMessage);
            return response.IsSuccessStatusCode;
        }

        /// <summary>
        /// Retrieves available tables for a specified date, time and number of guests.
        /// </summary>
        public async Task<JsonElement?> GetAvailableTablesAsync(DateTime date, TimeSpan time, int guests, bool includeUnavailable = false)
        {
            var query = new Dictionary<string, string?>
            {
                ["date"] = date.ToString("yyyy-MM-dd"),
                ["time"] = time.ToString(@"hh\:mm"),
                ["guests"] = guests.ToString(),
                ["includeUnavailable"] = includeUnavailable ? "true" : null
            };
            var queryString = string.Join("&", query.Where(kvp => kvp.Value != null).Select(kvp => $"{kvp.Key}={Uri.EscapeDataString(kvp.Value!)}"));
            var response = await _client.GetAsync($"api/tables/available?{queryString}");
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<JsonElement>(json, SerializerOptions);
        }
    }
}
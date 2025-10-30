namespace RestaurantWebsite.Models
{
    /// <summary>
    /// Represents configuration settings for the REST API backend.
    /// </summary>
    public class ApiSettings
    {
        /// <summary>
        /// Base URL for the backend REST API (e.g. https://localhost:7037/).
        /// This should end with a trailing slash.
        /// </summary>
        public string BaseUrl { get; set; } = "https://localhost:7037/";
    }
}
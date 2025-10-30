namespace RestaurantWebsite.Models
{
    /// <summary>
    /// Request object used to authenticate a user (admin) against the API.
    /// </summary>
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
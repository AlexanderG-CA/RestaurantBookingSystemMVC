namespace RestaurantWebsite.Models
{
    /// <summary>
    /// Response from the authentication endpoint containing the JWT and its expiry.
    /// </summary>
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expires { get; set; }
    }
}
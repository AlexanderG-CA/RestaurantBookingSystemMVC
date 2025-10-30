using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Options;
using RestaurantWebsite.Models;
using RestaurantWebsite.Services;

var builder = WebApplication.CreateBuilder(args);

// Logging (handy to see the BaseUrl used at startup)
builder.Logging.AddConsole();

// MVC
builder.Services.AddControllersWithViews();

// Bind and validate ApiSettings
builder.Services
    .AddOptions<ApiSettings>()
    .Bind(builder.Configuration.GetSection("ApiSettings"))
    .Validate(s => !string.IsNullOrWhiteSpace(s.BaseUrl),
        "ApiSettings:BaseUrl is missing. Set it in appsettings.json.")
    .Validate(s => Uri.TryCreate(s.BaseUrl, UriKind.Absolute, out _),
        "ApiSettings:BaseUrl must be an absolute URI (e.g., https://localhost:7029/).")
    .ValidateOnStart();

// Register HttpClient for ApiService with a guarded, normalized BaseAddress
builder.Services.AddHttpClient<ApiService>((sp, client) =>
{
    var settings = sp.GetRequiredService<IOptions<ApiSettings>>().Value;

    var baseUrl = settings.BaseUrl.Trim();
    if (!baseUrl.EndsWith("/"))
        baseUrl += "/";

    client.BaseAddress = new Uri(baseUrl, UriKind.Absolute);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

// Session to store JWT
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(1);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Cookie authentication for admin login
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/Login";
    });

// NOTE: No need for AddScoped<ApiService>() because AddHttpClient already registers it.

var app = builder.Build();

// HTTPS redirect (useful if your API runs on https)
app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

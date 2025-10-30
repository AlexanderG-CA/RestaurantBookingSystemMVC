using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantWebsite.Models;
using RestaurantWebsite.Services;
using System.Security.Claims;

namespace RestaurantWebsite.Controllers
{
    /// <summary>
    /// Handles administrator authentication. Uses the API's login endpoint to obtain a JWT
    /// which is then stored in the session. Also issues a cookie for MVC authentication.
    /// </summary>
    public class AccountController : Controller
    {
        private readonly ApiService _apiService;
        public AccountController(ApiService apiService)
        {
            _apiService = apiService;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Login(string? returnUrl = null)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View(new LoginRequest());
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginRequest model, string? returnUrl = null)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var authResponse = await _apiService.LoginAsync(model);
            if (authResponse == null)
            {
                ModelState.AddModelError(string.Empty, "Invalid username or password.");
                return View(model);
            }
            // Store token in session
            HttpContext.Session.SetString("JwtToken", authResponse.Token);
            // Issue cookie authentication
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, model.Username)
            };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = authResponse.Expires.ToUniversalTime()
            };
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);
            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Admin");
        }

        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.Session.Remove("JwtToken");
            return RedirectToAction("Login");
        }
    }
}
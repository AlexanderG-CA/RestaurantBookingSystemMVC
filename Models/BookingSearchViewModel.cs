using System;
using System.Collections.Generic;
using RestaurantWebsite.Models;

namespace RestaurantWebsite.Models
{
    /// <summary>
    /// View model used for searching available tables on the public booking page.
    /// Visitors can pick a date, time and number of guests and view which tables
    /// are available. The list of <see cref="Table"/> objects will be populated
    /// after querying the REST API for availability.
    /// </summary>
    public class BookingSearchViewModel
    {
        /// <summary>
        /// Desired booking date. Defaults to today.
        /// </summary>
        public DateTime BookingDate { get; set; } = DateTime.Today;

        /// <summary>
        /// Desired start time for the booking. Defaults to 18:00 (6 PM).
        /// </summary>
        public TimeSpan StartTime { get; set; } = new TimeSpan(18, 0, 0);

        /// <summary>
        /// Number of guests for the booking. Defaults to two.
        /// </summary>
        public int NumberOfGuests { get; set; } = 2;

        /// <summary>
        /// List of available tables returned from the API. This will be null
        /// until a search has been performed.
        /// </summary>
        public List<Table>? AvailableTables { get; set; }
    }
}

using System.Collections.Generic;
using RestaurantWebsite.Models;

namespace RestaurantWebsite.Models
{
    public class EditBookingViewModel
    {
        public Booking Booking { get; set; }
        public List<Table> Tables { get; set; }
    }
}

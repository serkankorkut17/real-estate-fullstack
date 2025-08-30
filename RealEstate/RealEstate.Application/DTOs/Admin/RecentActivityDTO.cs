using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Admin
{
    public class RecentActivityDTO
    {
        public string Action { get; set; } = string.Empty;
        public string Item { get; set; } = string.Empty;
        public DateTime Time { get; set; } = DateTime.UtcNow;
    }
}
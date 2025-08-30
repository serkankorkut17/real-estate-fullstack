using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Admin
{
    public class DashboardDTO
    {
        public int TotalProperties { get; set; }
        public int ForSaleProperties { get; set; }
        public int ForRentProperties { get; set; }
        public int ActiveUsers { get; set; }
        public List<PropertyTypeStatsDTO> PropertyTypeStats { get; set; } = new();
        public ChartDataDTO ChartData { get; set; } = new();
        public List<RecentActivityDTO> RecentActivities { get; set; } = new();
    }
}
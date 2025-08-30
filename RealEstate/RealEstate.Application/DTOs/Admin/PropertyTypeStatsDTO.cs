using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Admin
{
    public class PropertyTypeStatsDTO
    {
        public string Name { get; set; } = string.Empty;
        public int Count { get; set; } = 0;
        public double Percentage { get; set; } = 0.0;
    }
}
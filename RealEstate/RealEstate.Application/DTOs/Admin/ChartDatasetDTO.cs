using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Admin
{
    public class ChartDatasetDTO
    {
        public string Label { get; set; } = string.Empty;
        public List<int> Data { get; set; } = new();
    }
}
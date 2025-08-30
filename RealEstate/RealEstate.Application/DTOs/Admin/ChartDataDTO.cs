using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Admin
{
    public class ChartDataDTO
    {
        public List<string> Labels { get; set; } = new();
        public List<ChartDatasetDTO> Datasets { get; set; } = new();
    }
}
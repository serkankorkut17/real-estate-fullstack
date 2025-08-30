using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Admin
{
    public class MonthlyTrendDTO
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public int ForSale { get; set; }
        public int ForRent { get; set; }
    }
}
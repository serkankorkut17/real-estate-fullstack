using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.DTOs.Property
{
    public class PropertyMediaDTO
    {
        public int Id { get; set; }
        public string MediaType { get; set; } = MediaTypeEnum.Image.ToString();
        public string Url { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
    }
}
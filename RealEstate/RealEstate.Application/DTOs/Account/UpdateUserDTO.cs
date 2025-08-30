using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Account
{
    public class UpdateUserDTO
    {
        public string? FirstName { get; set; } = null;
        public string? LastName { get; set; } = null;
        public string? PhoneNumber { get; set; } = null;
    }
}
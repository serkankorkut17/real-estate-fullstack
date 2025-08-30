using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Account
{
    public class TokenResultDTO
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }

    }
}
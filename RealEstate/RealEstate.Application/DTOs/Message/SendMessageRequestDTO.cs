using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Message
{
  public class SendMessageRequestDTO
  {
    public string Content { get; set; } = null!;
  }
}
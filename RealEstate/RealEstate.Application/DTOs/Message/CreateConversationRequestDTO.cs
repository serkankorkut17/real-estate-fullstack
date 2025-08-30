using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Message
{
    public class CreateConversationRequestDTO
    {
        public int ParticipantId { get; set; }
        public int? PropertyId { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Application.DTOs.Message;

namespace RealEstate.API.Hubs
{
    public interface IChatClient
    {
        Task MessageReceived(MessageResponseDTO message);
        Task ConversationRead(int conversationId, int readerUserId);
        Task Typing(int conversationId, int userId, bool isTyping);
    }
}
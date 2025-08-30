using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Message
{
    public class ConversationSummaryDTO
    {
        public int ConversationId { get; set; }
        public int Id { get; set; }
        public int UserAId { get; set; }
        public int UserBId { get; set; }
        public int OtherUserId { get; set; }
        public string OtherUserFirstName { get; set; } = "";
        public string OtherUserLastName { get; set; } = "";
        public string? OtherUserProfilePictureUrl { get; set; }
        public int? PropertyId { get; set; }
        public string PropertyTitle { get; set; } = "";
        public int LastMessageId { get; set; }
        public string LastMessage { get; set; } = "";
        public DateTime LastMessageAt { get; set; }
        public int LastMessageSenderId { get; set; }
        public int LastMessageReceiverId { get; set; }
        public bool LastMessageIsMine { get; set; }


        public int UnreadCount { get; set; }
    }
}
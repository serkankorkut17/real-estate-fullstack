using System;
using System.Collections.Generic;

namespace RealEstate.Domain.Entities
{
    public class Conversation
    {
        public int Id { get; set; }
        public int UserAId { get; set; }
        public int UserBId { get; set; }

        public int SmallerUserId { get; set; }
        public int LargerUserId { get; set; }

        public int? PropertyId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastMessageAt { get; set; } = DateTime.UtcNow;

        // Navigations
        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public Property? Property { get; set; }

        public Conversation()
        {
            SmallerUserId = Math.Min(UserAId, UserBId);
            LargerUserId = Math.Max(UserAId, UserBId);
        }
    }
}
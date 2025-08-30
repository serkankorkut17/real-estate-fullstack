using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Data;

namespace RealEstate.Infrastructure.Repositories
{
    public class ChatRepository : IChatRepository
    {
        private readonly ApplicationDbContext _db;
        public ChatRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<Conversation?> GetConversationByIdAsync(int conversationId, CancellationToken ct = default)
        {
            return await _db.Conversations
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == conversationId, ct);
        }

        public async Task<Conversation> GetOrCreateAsync(int userAId, int userBId, int? propertyId, CancellationToken ct = default)
        {
            var s = Math.Min(userAId, userBId);
            var l = Math.Max(userAId, userBId);

            var conv = await _db.Conversations
                .FirstOrDefaultAsync(c => c.SmallerUserId == s && c.LargerUserId == l && c.PropertyId == propertyId, ct);

            if (conv != null) return conv;

            conv = new Conversation
            {
                UserAId = userAId,
                UserBId = userBId,
                SmallerUserId = s,
                LargerUserId = l,
                PropertyId = propertyId,
                CreatedAt = DateTime.UtcNow,
                LastMessageAt = DateTime.UtcNow
            };

            _db.Conversations.Add(conv);
            await _db.SaveChangesAsync(ct);
            return conv;
        }

        public async Task<IReadOnlyList<Conversation>> GetConversationsAsync(int me, int page, int pageSize, CancellationToken ct = default)
        {
            if (page < 1) page = 1;
            if (pageSize <= 0 || pageSize > 200) pageSize = 50;

            return await _db.Conversations.AsNoTracking()
                .Where(c => c.UserAId == me || c.UserBId == me)
                .Include(c => c.Property)
                .OrderByDescending(c => c.LastMessageAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);
        }

        public async Task<Message> AddMessageAsync(Message message, CancellationToken ct = default)
        {
            await _db.Messages.AddAsync(message, ct);

            var conv = await _db.Conversations.FirstOrDefaultAsync(c => c.Id == message.ConversationId, ct);
            if (conv != null)
            {
                conv.LastMessageAt = message.CreatedAt;
            }

            return message;
        }

        public async Task<IReadOnlyList<Message>> GetMessagesAsync(int conversationId, int page, int pageSize, CancellationToken ct = default)
        {
            if (page < 1) page = 1;
            if (pageSize <= 0 || pageSize > 200) pageSize = 50;

            return await _db.Messages.AsNoTracking()
                .Where(m => m.ConversationId == conversationId)
                .OrderBy(m => m.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);
        }

        public Task<Message?> GetMessageByIdAsync(int messageId, CancellationToken ct = default)
        {
            return _db.Messages.FirstOrDefaultAsync(m => m.Id == messageId, ct)!;
        }

        public async Task<int> MarkConversationAsReadAsync(int me, int conversationId, CancellationToken ct = default)
        {
            var affected = await _db.Messages
                .Where(m => m.ConversationId == conversationId && m.ReceiverId == me && !m.IsRead)
                .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.IsRead, true), ct);

            return affected;
        }

        public async Task<int> GetUnreadCountAsync(int me, int conversationId, CancellationToken ct = default)
        {
            return await _db.Messages.AsNoTracking()
                .Where(m => m.ConversationId == conversationId && m.ReceiverId == me && !m.IsRead)
                .CountAsync(ct);
        }

        public async Task<(string FirstName, string LastName, string? ProfilePictureUrl)?> GetUserBasicAsync(int userId, CancellationToken ct = default)
        {
            var result = await _db.Users
                .Where(u => u.Id == userId)
                .Select(u => new { u.FirstName, u.LastName, u.ProfilePictureUrl })
                .FirstOrDefaultAsync(ct);

            if (result == null) return null;
            return (result.FirstName ?? "unknown", result.LastName ?? "unknown", result.ProfilePictureUrl ?? "#");
        }

        public Task SaveChangesAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Interfaces
{
    public interface IChatRepository
    {
        // Conversations
        Task<Conversation?> GetConversationByIdAsync(int conversationId, CancellationToken ct = default);
        Task<Conversation> GetOrCreateAsync(int userAId, int userBId, int? propertyId, CancellationToken ct = default);
        Task<IReadOnlyList<Conversation>> GetConversationsAsync(int me, int page, int pageSize, CancellationToken ct = default);

        // Messages
        Task<Message> AddMessageAsync(Message message, CancellationToken ct = default);
        Task<IReadOnlyList<Message>> GetMessagesAsync(int conversationId, int page, int pageSize, CancellationToken ct = default);
        Task<Message?> GetMessageByIdAsync(int messageId, CancellationToken ct = default);

        // Read / counts
        Task<int> MarkConversationAsReadAsync(int me, int conversationId, CancellationToken ct = default);
        Task<int> GetUnreadCountAsync(int me, int conversationId, CancellationToken ct = default);

        // User info (liste için diğer kullanıcının adı/pp)
        Task<(string FirstName, string LastName, string? ProfilePictureUrl)?> GetUserBasicAsync(int userId, CancellationToken ct = default);

        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Application.DTOs.Message;

namespace RealEstate.Application.Interfaces
{
    public interface IChatService
    {
        // Conversations
        Task<IEnumerable<ConversationSummaryDTO>> GetConversationsAsync(int me, int page = 1, int pageSize = 50, CancellationToken ct = default);
        Task<CreateConversationResponseDTO> GetOrCreateConversationAsync(int me, CreateConversationRequestDTO req, CancellationToken ct = default);
        Task<IEnumerable<MessageResponseDTO>> GetMessagesAsync(int me, int conversationId, int page = 1, int pageSize = 50, CancellationToken ct = default);

        // Send
        Task<MessageResponseDTO> SendToConversationAsync(int me, int conversationId, SendMessageRequestDTO req, CancellationToken ct = default);

        // Read
        Task<MessageResponseDTO?> MarkMessageAsReadAsync(int me, int messageId, CancellationToken ct = default);
        Task MarkConversationAsReadAsync(int me, int conversationId, CancellationToken ct = default);
    }
}
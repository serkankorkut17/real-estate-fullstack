using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Application.DTOs.Message;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Repositories;

namespace RealEstate.Infrastructure.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _repo;
        public ChatService(IChatRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<ConversationSummaryDTO>> GetConversationsAsync(int me, int page = 1, int pageSize = 50, CancellationToken ct = default)
        {
            var conversations = await _repo.GetConversationsAsync(me, page, pageSize, ct);

            var result = new List<ConversationSummaryDTO>(conversations.Count);
            foreach (var c in conversations)
            {
                var otherId = c.UserAId == me ? c.UserBId : c.UserAId;

                // Son mesaj (hız için en yeni bir tane; çok yoğunsa optimizasyon yapılabilir)
                var lastMsg = await _repo.GetMessagesAsync(c.Id, page: 1, pageSize: 1, ct);
                var last = lastMsg.LastOrDefault(); // OrderBy asc verdiğimiz için son eleman

                // Unread count
                var unread = await _repo.GetUnreadCountAsync(me, c.Id, ct);

                // Other user basic
                var other = await _repo.GetUserBasicAsync(otherId, ct);

                result.Add(new ConversationSummaryDTO
                {
                    ConversationId = c.Id,
                    Id = c.Id,
                    UserAId = c.UserAId,
                    UserBId = c.UserBId,
                    OtherUserId = otherId,
                    OtherUserFirstName = other?.FirstName ?? "",
                    OtherUserLastName = other?.LastName ?? "",
                    OtherUserProfilePictureUrl = other?.ProfilePictureUrl,
                    PropertyId = c.PropertyId,
                    PropertyTitle = c.Property?.Title ?? "",
                    LastMessageId = last?.Id ?? 0,
                    LastMessage = last?.Content ?? "",
                    LastMessageAt = last?.CreatedAt ?? c.LastMessageAt,
                    LastMessageSenderId = last?.SenderId ?? 0,
                    LastMessageReceiverId = last?.ReceiverId ?? 0,
                    LastMessageIsMine = last?.SenderId == me,

                    UnreadCount = unread
                });
            }

            return result.OrderByDescending(x => x.LastMessageAt).ToList();
        }

        public async Task<CreateConversationResponseDTO> GetOrCreateConversationAsync(int me, CreateConversationRequestDTO req, CancellationToken ct = default)
        {
            if (req.ParticipantId <= 0) throw new ArgumentException("ParticipantId is required.");
            if (req.ParticipantId == me) throw new ArgumentException("You cannot start a conversation with yourself.");

            var conv = await _repo.GetOrCreateAsync(me, req.ParticipantId, req.PropertyId, ct);
            return new CreateConversationResponseDTO { ConversationId = conv.Id, Id = conv.Id };
        }

        public async Task<IEnumerable<MessageResponseDTO>> GetMessagesAsync(int me, int conversationId, int page = 1, int pageSize = 50, CancellationToken ct = default)
        {
            var conv = await _repo.GetConversationByIdAsync(conversationId, ct)
                ?? throw new KeyNotFoundException("Conversation not found.");

            if (conv.UserAId != me && conv.UserBId != me)
                throw new UnauthorizedAccessException("Not a participant of this conversation.");

            var list = await _repo.GetMessagesAsync(conversationId, page, pageSize, ct);

            return list.Select(m => new MessageResponseDTO
            {
                Id = m.Id,
                ConversationId = m.ConversationId,
                SenderId = m.SenderId,
                ReceiverId = m.ReceiverId,
                Content = m.Content,
                CreatedAt = m.CreatedAt,
                IsRead = m.IsRead
            });
        }

        public async Task<MessageResponseDTO> SendToConversationAsync(int me, int conversationId, SendMessageRequestDTO req, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(req.Content)) throw new ArgumentException("Content is required.");

            var conv = await _repo.GetConversationByIdAsync(conversationId, ct)
                ?? throw new KeyNotFoundException("Conversation not found.");

            if (conv.UserAId != me && conv.UserBId != me)
                throw new UnauthorizedAccessException("Not a participant of this conversation.");

            var receiverId = conv.UserAId == me ? conv.UserBId : conv.UserAId;

            var msg = new Message
            {
                ConversationId = conversationId,
                SenderId = me,
                ReceiverId = receiverId,
                Content = req.Content.Trim(),
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _repo.AddMessageAsync(msg, ct);
            await _repo.SaveChangesAsync(ct);

            return new MessageResponseDTO
            {
                Id = msg.Id,
                ConversationId = msg.ConversationId,
                SenderId = msg.SenderId,
                ReceiverId = msg.ReceiverId,
                Content = msg.Content,
                CreatedAt = msg.CreatedAt,
                IsRead = msg.IsRead
            };
        }

        public async Task<MessageResponseDTO?> MarkMessageAsReadAsync(int me, int messageId, CancellationToken ct = default)
        {
            var msg = await _repo.GetMessageByIdAsync(messageId, ct);
            if (msg == null) return null;

            if (msg.ReceiverId != me) return null; // sadece alıcı okuyabilir

            if (!msg.IsRead)
            {
                msg.IsRead = true;
                await _repo.SaveChangesAsync(ct);
            }

            return new MessageResponseDTO
            {
                Id = msg.Id,
                ConversationId = msg.ConversationId,
                SenderId = msg.SenderId,
                ReceiverId = msg.ReceiverId,
                Content = msg.Content,
                CreatedAt = msg.CreatedAt,
                IsRead = msg.IsRead
            };
        }

        public Task MarkConversationAsReadAsync(int me, int conversationId, CancellationToken ct = default)
            => _repo.MarkConversationAsReadAsync(me, conversationId, ct);
    }
}
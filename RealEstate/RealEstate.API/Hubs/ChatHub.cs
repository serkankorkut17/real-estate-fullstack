using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using RealEstate.Application.DTOs.Message;
using RealEstate.Application.Interfaces;

namespace RealEstate.API.Hubs
{
    [Authorize]
    public class ChatHub : Hub<IChatClient>
    {
        private readonly IChatService _chat;
        public ChatHub(IChatService chat)
        {
            _chat = chat;
        }

        private int UserId()
        {
            var idStr = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(idStr, out var id) ? id : 0;
        }

        private static string ConvGroup(int conversationId) => $"conv:{conversationId}";
        private static string UserGroup(int userId) => $"user:{userId}";

        public override async Task OnConnectedAsync()
        {
            var me = UserId();
            if (me > 0)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, UserGroup(me));
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var me = UserId();
            if (me > 0)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, UserGroup(me));
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinConversation(int conversationId)
        {
            var me = UserId();

            _ = await _chat.GetMessagesAsync(me, conversationId, 1, 1);
            await Groups.AddToGroupAsync(Context.ConnectionId, ConvGroup(conversationId));
        }

        public Task LeaveConversation(int conversationId)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, ConvGroup(conversationId));
        }

        public async Task<MessageResponseDTO> SendMessage(int conversationId, string content)
        {
            var me = UserId();
            var dto = await _chat.SendToConversationAsync(me, conversationId, new SendMessageRequestDTO { Content = content });
            await Clients.Group(ConvGroup(conversationId)).MessageReceived(dto);
            return dto;
        }

        public async Task MarkConversationRead(int conversationId)
        {
            var me = UserId();
            await _chat.MarkConversationAsReadAsync(me, conversationId);
            await Clients.Group(ConvGroup(conversationId)).ConversationRead(conversationId, me);
        }

        public Task Typing(int conversationId, bool isTyping)
        {
            var me = UserId();
            return Clients.OthersInGroup(ConvGroup(conversationId)).Typing(conversationId, me, isTyping);
        }
    }
}
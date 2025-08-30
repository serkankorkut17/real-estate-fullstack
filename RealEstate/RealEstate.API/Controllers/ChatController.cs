using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Application.DTOs.Message;
using RealEstate.Application.Interfaces;

namespace RealEstate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chat;
        public ChatController(IChatService chat)
        {
            _chat = chat;
        }

        private int RequireUserId()
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(idStr, out var id) || id <= 0)
                throw new UnauthorizedAccessException("Unauthorized");
            return id;
        }

        // GET /api/chat/conversations?page=1&pageSize=50
        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations([FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
        {
            var me = RequireUserId();
            var list = await _chat.GetConversationsAsync(me, page, pageSize, ct);
            return Ok(list);
        }

        // POST /api/chat/conversations  body: { participantId, propertyId? }
        [HttpPost("conversations")]
        public async Task<IActionResult> GetOrCreateConversation([FromBody] CreateConversationRequestDTO req, CancellationToken ct)
        {
            var me = RequireUserId();
            var res = await _chat.GetOrCreateConversationAsync(me, req, ct);
            return Ok(res);
        }

        // GET /api/chat/conversations/{conversationId}/messages?page=1&pageSize=50
        [HttpGet("conversations/{conversationId:int}/messages")]
        public async Task<IActionResult> GetMessages(int conversationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
        {
            var me = RequireUserId();
            var list = await _chat.GetMessagesAsync(me, conversationId, page, pageSize, ct);
            return Ok(list);
        }

        // POST /api/chat/conversations/{conversationId}/messages   body: { content }
        [HttpPost("conversations/{conversationId:int}/messages")]
        public async Task<IActionResult> SendToConversation(int conversationId, [FromBody] SendMessageRequestDTO req, CancellationToken ct)
        {
            var me = RequireUserId();
            var msg = await _chat.SendToConversationAsync(me, conversationId, req, ct);
            return Ok(msg);
        }


        // PUT /api/chat/messages/{messageId}/read
        [HttpPut("messages/{messageId:int}/read")]
        public async Task<IActionResult> MarkMessageRead(int messageId, CancellationToken ct)
        {
            var me = RequireUserId();
            var updated = await _chat.MarkMessageAsReadAsync(me, messageId, ct);
            if (updated is null) return NotFound();
            return Ok(updated);
        }

        // PUT /api/chat/conversations/{conversationId}/read
        [HttpPut("conversations/{conversationId:int}/read")]
        public async Task<IActionResult> MarkConversationRead(int conversationId, CancellationToken ct)
        {
            var me = RequireUserId();
            await _chat.MarkConversationAsReadAsync(me, conversationId, ct);
            return NoContent();
        }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Domain.Entities
{
  public class Message
  {
    public int Id { get; set; }
    public int ConversationId { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    [Required]
    [MaxLength(1000)]
    public string Content { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;

    // Navigation
    public Conversation? Conversation { get; set; }
    public ApplicationUser? Sender { get; set; }
    public ApplicationUser? Receiver { get; set; }

  }
}
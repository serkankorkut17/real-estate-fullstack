using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Domain.Entities
{
    public class PropertyMedia
    {
        public int Id { get; set; }
        public int PropertyId { get; set; }
        public virtual Property? Property { get; set; }
        public MediaTypeEnum Type { get; set; }
        public string FileName { get; set; } = null!;
        public string Url { get; set; } = null!;
        public bool IsPrimary { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }

    public enum MediaTypeEnum
    {
        Image = 1,
        Video = 2
    }
}
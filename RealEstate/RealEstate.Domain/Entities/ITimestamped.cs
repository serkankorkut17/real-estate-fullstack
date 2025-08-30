using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Domain.Entities
{
  public interface ITimestamped
  {
    DateTime CreatedDate { get; set; }
    DateTime? LastModifiedDate { get; set; }
  }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendPasswordResetEmailAsync(string userName, string toEmail, string resetToken);
    }
}
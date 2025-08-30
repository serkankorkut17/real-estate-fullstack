using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Account
{
    public class RegisterRequestDTO
    {
        // First name
        [Required(ErrorMessage = "First name is required.")]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "First name can only contain letters and spaces.")]
        [StringLength(50, ErrorMessage = "First name cannot be longer than 50 characters.")]
        [MinLength(2, ErrorMessage = "First name must be at least 2 characters long.")]
        public string FirstName { get; set; } = string.Empty;

        // Last name
        [Required(ErrorMessage = "Last name is required.")]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Last name can only contain letters and spaces.")]
        [StringLength(50, ErrorMessage = "Last name cannot be longer than 50 characters.")]
        [MinLength(2, ErrorMessage = "Last name must be at least 2 characters long.")]
        public string LastName { get; set; } = string.Empty;

        // Email
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        [StringLength(50, ErrorMessage = "Email cannot be longer than 50 characters.")]
        public string Email { get; set; } = string.Empty;

        // Password
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$", ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one number.")]
        [StringLength(32, ErrorMessage = "Password cannot be longer than 32 characters.")]
        public string Password { get; set; } = string.Empty;

        // Confirm Password
        [Required(ErrorMessage = "Confirm Password is required.")]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        [MinLength(8, ErrorMessage = "Confirm Password must be at least 8 characters long.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
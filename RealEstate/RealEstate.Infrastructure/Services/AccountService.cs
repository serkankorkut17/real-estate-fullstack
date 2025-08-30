using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using AutoMapper;
using RealEstate.Application.DTOs.Account;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace RealEstate.Infrastructure.Services
{
  public class AccountService : IAccountService
  {
    private readonly IAccountRepository _accountRepository;
    private readonly IEmailService _emailService;
    private readonly IFileService _fileService;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AccountService(IAccountRepository accountRepository, IEmailService emailService, IFileService fileService, IMapper mapper, IConfiguration configuration)
    {
      _accountRepository = accountRepository;
      _emailService = emailService;
      _fileService = fileService;
      _mapper = mapper;
      _configuration = configuration;
    }

    // Login Service
    public async Task<LoginResponseDTO> AuthenticateUserAsync(LoginRequestDTO loginRequest)
    {
      var user = await _accountRepository.FindUserByEmailAsync(loginRequest.Email);
      if (user == null || !await _accountRepository.CheckPasswordAsync(user, loginRequest.Password))
      {
        throw new UnauthorizedAccessException("Invalid email or password.");
      }

      var roles = await _accountRepository.GetUserRoles(user.Id);

      // Update last login date
      user.LastLoginDate = DateTime.UtcNow;
      await _accountRepository.UpdateUserAsync(user);

      var tokenResult = await GenerateToken(user);

      var response = _mapper.Map<LoginResponseDTO>(user, opt =>
      {
        opt.Items["Token"] = tokenResult.Token;
        opt.Items["Expiration"] = tokenResult.Expiration;
      });
      response.Role = roles.FirstOrDefault() ?? "User";

      return response;
    }

    // Change User Password
    public async Task<bool> ChangeUserPasswordAsync(int userId, string currentPassword, string newPassword)
    {
      var user = await _accountRepository.FindUserByIdAsync(userId);
      if (user == null || !await _accountRepository.CheckPasswordAsync(user, currentPassword))
      {
        return false; // User not found or current password is incorrect
      }

      return await _accountRepository.ChangePasswordAsync(user, currentPassword, newPassword);
    }

    // Forgot User Password
    public async Task<bool> ForgotPasswordAsync(ForgotPasswordDTO dto)
    {
      var user = await _accountRepository.FindUserByEmailAsync(dto.Email);
      if (user == null)
        return false;

      // Generate a password reset token
      var token = await _accountRepository.GeneratePasswordResetTokenAsync(user);

      if (string.IsNullOrEmpty(token) || user.Email == null)
        return false;

      // Send a email for resetting password
      string userName = $"{user.FirstName} {user.LastName}".Trim();
      await _emailService.SendPasswordResetEmailAsync(userName, user.Email, token);

      return true;
    }

    // Generate JWT Token
    public async Task<TokenResultDTO> GenerateToken(ApplicationUser user)
    {
      var roles = await _accountRepository.GetUserRoles(user.Id);
      var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim("firstName", user.FirstName ?? string.Empty),
                new Claim("lastName", user.LastName ?? string.Empty),
            };
      // Add roles to claims
      foreach (var role in roles)
      {
        claims.Add(new Claim(ClaimTypes.Role, role));
      }

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
      var expiration = DateTime.UtcNow.AddDays(7);

      var token = new JwtSecurityToken(
          issuer: _configuration["Jwt:Issuer"],
          audience: _configuration["Jwt:Audience"],
          claims: claims,
          expires: expiration,
          signingCredentials: creds
      );

      return new TokenResultDTO
      {
        Token = new JwtSecurityTokenHandler().WriteToken(token),
        Expiration = expiration
      };
    }

    // Signup A New User
    public async Task<bool> RegisterUserAsync(RegisterRequestDTO registerRequest)
    {
      if (await _accountRepository.CheckUserExistsAsync(registerRequest.Email))
      {
        return false; // User with this email already exists
      }

      var user = _mapper.Map<ApplicationUser>(registerRequest);

      var result = await _accountRepository.CreateUserAsync(user, registerRequest.Password);

      return result;
    }

    // Reset User Password
    public async Task<bool> ResetUserPasswordAsync(ResetPasswordDTO dto)
    {
      var user = await _accountRepository.FindUserByEmailAsync(dto.Email);
      if (user == null)
        return false;

      return await _accountRepository.ResetPasswordAsync(user, dto.Token, dto.NewPassword);
    }

    public async Task<bool> UpdateUserProfileAsync(int userId, UpdateUserDTO dto, IFormFile? imageFile = null)
    {
      var user = await _accountRepository.FindUserByIdAsync(userId);
      if (user == null)
        return false;

      if (imageFile != null)
      {
        if (!string.IsNullOrEmpty(user.ProfilePictureUrl))
        {
          Console.WriteLine($"Text: {user.ProfilePictureUrl}");

          await _fileService.DeleteImageAsync(user.ProfilePictureUrl, "profile_images");
        }
        var imageUrl = await _fileService.UploadImageAsync(imageFile, "profile_images");
        user.ProfilePictureUrl = imageUrl;
      }
      
      if (!string.IsNullOrEmpty(dto.FirstName))
      {
        user.FirstName = dto.FirstName;
      }
      if (!string.IsNullOrEmpty(dto.LastName))
      {
        user.LastName = dto.LastName;
      }
      if (!string.IsNullOrEmpty(dto.PhoneNumber))
      {
        user.PhoneNumber = dto.PhoneNumber;
      }

      return await _accountRepository.UpdateUserAsync(user);
    }
    public async Task<UserResponseDTO> ValidateUserAsync(int userId)
    {
      var user = await _accountRepository.FindUserByIdAsync(userId);
      if (user == null)
        throw new KeyNotFoundException("User not found.");

      var roles = await _accountRepository.GetUserRoles(user.Id);

      var userResponse = _mapper.Map<UserResponseDTO>(user);
      userResponse.Role = roles.FirstOrDefault() ?? "User";

      return userResponse;
    }
  }
}
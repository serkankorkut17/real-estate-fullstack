using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Application.DTOs.Account;
using RealEstate.Application.Interfaces;
using Serilog;

namespace RealEstate.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AccountController : ControllerBase
  {
    private readonly IAccountService _accountService;
    private readonly ILogger<AccountController> _logger;

    public AccountController(IAccountService accountService, ILogger<AccountController> logger)
    {
      _accountService = accountService;
      _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequest)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      try
      {
        var response = await _accountService.AuthenticateUserAsync(loginRequest);
        if (response == null)
        {
          _logger.LogWarning("Login attempt failed for user: {Email}", loginRequest.Email);
          return Unauthorized("Invalid email or password.");
        }

        _logger.LogInformation("Login attempt for user: {Email}", loginRequest.Email);

        return Ok(response);
      }
      catch (UnauthorizedAccessException ex)
      {
        _logger.LogWarning(ex, "Unauthorized access attempt for user: {Email}", loginRequest.Email);
        return Unauthorized("Invalid email or password.");
      }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequest)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var result = await _accountService.RegisterUserAsync(registerRequest);
      if (!result)
      {
        _logger.LogWarning("Registration attempt failed: User with this email already exists.");
        return BadRequest("User registration failed. User with this email already exists.");
      }

      _logger.LogInformation("User registered successfully: {Email}", registerRequest.Email);
      return CreatedAtAction(nameof(Login), new { email = registerRequest.Email });
    }

    [Authorize]
    [HttpPatch("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDTO dto)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
      if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int parsedUserId))
      {
        _logger.LogWarning("Password change failed: User ID is null or empty or not a valid integer.");
        return Unauthorized("User is not authenticated.");
      }
      var result = await _accountService.ChangeUserPasswordAsync(parsedUserId, dto.CurrentPassword, dto.NewPassword);
      if (!result)
      {
        _logger.LogWarning("Password change failed for user: {UserId}", userId);
        return BadRequest("Password change failed. Please check your current password and try again.");
      }
      _logger.LogInformation("Password changed successfully for user: {UserId}", userId);
      return Ok("Password changed successfully.");
    }

    [Authorize]
    [Consumes("multipart/form-data")]
    [HttpPut("update-profile")]
    public async Task<IActionResult> UpdateProfile([FromForm] UpdateUserDTO dto, IFormFile? imageFile = null)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
      
      if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int parsedUserId))
      {
        _logger.LogWarning("Profile update failed: User ID is null or empty or not a valid integer.");
        return Unauthorized("User is not authenticated.");
      }

      var result = await _accountService.UpdateUserProfileAsync(parsedUserId, dto, imageFile);
      if (!result)
      {
        _logger.LogWarning("Profile update failed for user: {UserId}", userId);
        return BadRequest("Profile update failed. Please check the provided information.");
      }

      _logger.LogInformation("Profile updated successfully for user: {UserId}", userId);
      return Ok("Profile updated successfully.");
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO dto)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var result = await _accountService.ForgotPasswordAsync(dto);
      if (!result)
      {
        _logger.LogWarning("Password reset email failed to send to: {Email}", dto.Email);
        return BadRequest("Failed to send password reset email. Please check the email address.");
      }

      _logger.LogInformation("Password reset email sent to: {Email}", dto.Email);
      return Ok("Password reset email sent successfully.");
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var result = await _accountService.ResetUserPasswordAsync(dto);
      if (!result)
      {
        _logger.LogWarning("Password reset failed for user: {Email}", dto.Email);
        return BadRequest("Failed to reset password. Please check the provided information.");
      }

      _logger.LogInformation("Password reset successfully for user: {Email}", dto.Email);
      return Ok("Password reset successfully.");
    }

    [Authorize]
    [HttpGet("validate-token")]
    public async Task<IActionResult> ValidateToken()
    {
      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
      if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int parsedUserId))
      {
        _logger.LogWarning("Token validation failed: User ID is null or empty or not a valid integer.");
        return Unauthorized("User is not authenticated.");
      }

      var user = await _accountService.ValidateUserAsync(parsedUserId);
      if (user == null)
      {
        _logger.LogWarning("Token validation failed for user: {UserId}", userId);
        return Unauthorized("Invalid token.");
      }

      return Ok(user);
    }
  }
}
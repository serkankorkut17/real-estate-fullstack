using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using RealEstate.Application.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace RealEstate.Infrastructure.Services
{
  public class ImageService : IImageService
  {
    private readonly ILogger<ImageService> _logger;

    public ImageService(ILogger<ImageService> logger)
    {
      _logger = logger;
    }

    // Max allowedfile size: 20MB and only jpg, jpeg, png, gif, webp formats allowed
    public void ValidateImageFile(IFormFile file)
    {
      var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
      var maxFileSize = 20 * 1024 * 1024; // 20MB

      if (file.Length > maxFileSize)
      {
        _logger.LogWarning("File too large: {FileName}. Maximum size: 20MB", file.FileName);
        throw new ArgumentException($"File too large: {file.FileName}. Maximum size: 20MB");
      }

      if (file.Length == 0)
      {
        _logger.LogWarning("File is empty: {FileName}", file.FileName);
        throw new ArgumentException($"File is empty: {file.FileName}");
      }

      var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
      if (!allowedExtensions.Contains(extension))
      {
        _logger.LogWarning("Invalid file format: {FileName}. Allowed: {AllowedExtensions}", file.FileName, string.Join(", ", allowedExtensions));
        throw new ArgumentException($"Invalid file format: {file.FileName}. Allowed: {string.Join(", ", allowedExtensions)}");
      }
    }

    // Max Allowed Image Count: 20
    public void ValidateImageFiles(List<IFormFile> files)
    {
      var maxFileCount = 20; // Max 20 images

      if (files.Count > maxFileCount)
      {
        _logger.LogWarning("Maximum {MaxFileCount} images allowed", maxFileCount);
        throw new ArgumentException($"Maximum {maxFileCount} images allowed");
      }

      foreach (var file in files)
      {
        ValidateImageFile(file);
      }
    }
    // Convert given IFormFile to WebP and return as IFormFile (in-memory)
    public async Task<MemoryStream> ConvertToWebpFormFileAsync(IFormFile file, int quality = 75, int? maxWidth = null, int? maxHeight = null)
    {
      var sourceStream = file.OpenReadStream();
      using var img = await Image.LoadAsync(sourceStream);
      if (maxWidth.HasValue || maxHeight.HasValue)
      {
        var targetWidth = maxWidth ?? img.Width;
        var targetHeight = maxHeight ?? img.Height;
        img.Mutate(x => x.Resize(new ResizeOptions { Mode = ResizeMode.Max, Size = new Size(targetWidth, targetHeight) }));
      }

      var webpStream = new MemoryStream();
      await img.SaveAsync(webpStream, new WebpEncoder { Quality = quality });
      webpStream.Position = 0;
      _logger.LogInformation("Converted image {FileName} to WebP format with quality {Quality}", file.FileName, quality);

      return webpStream;
    }
  }
}
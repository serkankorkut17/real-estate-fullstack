using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RealEstate.Application.Interfaces;

namespace RealEstate.Infrastructure.Services
{
  public class FileService : IFileService
  {
    private readonly Cloudinary _cloudinary;
    private readonly IImageService _imageService;
    private readonly ILogger<FileService> _logger;

    public FileService(IConfiguration configuration, IImageService imageService, ILogger<FileService> logger)
    {
      var account = new Account(
          configuration["Cloudinary:CloudName"],
          configuration["Cloudinary:ApiKey"],
          configuration["Cloudinary:ApiSecret"]
      );
      _cloudinary = new Cloudinary(account);
      _imageService = imageService;
      _logger = logger;
    }

    // Upload a single image to cloudinary
    public async Task<string> UploadImageAsync(IFormFile file, string folder = "properties")
    {
      if (file == null || file.Length == 0)
        throw new ArgumentException("File is empty");

      // var imageStream = await _imageService.ConvertToWebpFormFileAsync(file);
      using var imageStream = file.OpenReadStream();

      var uploadParams = new ImageUploadParams()
      {
        File = new FileDescription(file.FileName, imageStream),
        Folder = folder,
        Transformation = new Transformation()
            .Quality("auto")
            .FetchFormat("auto")
            // .Width(1200)
            // .Height(800)
            .Crop("fill"),
        PublicId = $"{folder}_{Guid.NewGuid()}"
      };

      var uploadResult = await _cloudinary.UploadAsync(uploadParams);
      _logger.LogInformation("Image uploaded to Cloudinary: {Url}", uploadResult.SecureUrl);

      if (uploadResult.Error != null)
      {
        _logger.LogError("Cloudinary upload error: {ErrorMessage}", uploadResult.Error.Message);
        throw new Exception($"Cloudinary upload error: {uploadResult.Error.Message}");
      }

      return uploadResult.SecureUrl.ToString();
    }

    // Upload multiple images to cloudinary
    public async Task<List<string>> UploadMultipleImagesAsync(List<IFormFile> files, string folder = "properties")
    {
      // Validate the image files
      _imageService.ValidateImageFiles(files);

      var uploadTasks = files.Select(file => UploadImageAsync(file, folder));
      var results = await Task.WhenAll(uploadTasks);
      return results.ToList();
    }

    // Delete an image from cloudinary
    public async Task<bool> DeleteImageAsync(string imageUrl, string folder = "properties")
    {
      if (string.IsNullOrWhiteSpace(imageUrl))
        throw new ArgumentException("Image URL cannot be null or empty");

      var publicId = ExtractPublicIdFromUrl(imageUrl, folder);
      var deleteParams = new DeletionParams(publicId);
      var result = await _cloudinary.DestroyAsync(deleteParams);
      _logger.LogInformation("Image deletion result: {result.Result} for public ID: {publicId}", result.Result, publicId);

      return result.Result == "ok";
    }

    // Extract the public ID from the image URL
    public static string ExtractPublicIdFromUrl(string imageUrl, string folder = "properties")
    {
      var uri = new Uri(imageUrl);
      var segments = uri.AbsolutePath.Split('/');

      var publicIdWithExtension = segments[^1];
      var publicId = publicIdWithExtension.Substring(0, publicIdWithExtension.LastIndexOf('.'));

      // Add folder path
      publicId = $"{folder}/{publicId}";

      return publicId;
    }
  }
}
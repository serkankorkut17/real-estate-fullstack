using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace RealEstate.Application.Interfaces
{
    public interface IFileService
    {
        Task<string> UploadImageAsync(IFormFile file, string folder = "properties");
        Task<bool> DeleteImageAsync(string imageUrl, string folder = "properties");
        Task<List<string>> UploadMultipleImagesAsync(List<IFormFile> files, string folder = "properties");
    }
}
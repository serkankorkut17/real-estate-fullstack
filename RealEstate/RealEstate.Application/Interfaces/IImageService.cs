using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace RealEstate.Application.Interfaces
{
    public interface IImageService
    {
        void ValidateImageFiles(List<IFormFile> files);
        void ValidateImageFile(IFormFile file);
        Task<MemoryStream> ConvertToWebpFormFileAsync(IFormFile file, int quality = 80, int? maxWidth = null, int? maxHeight = null);
    }
}
using RealEstate.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using RealEstate.Application.Mappings;
using AutoMapper;
using RealEstate.Application.Interfaces;
using RealEstate.Infrastructure.Repositories;
using RealEstate.Infrastructure.Services;
using RealEstate.Infrastructure.Extensions;
using RealEstate.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;
using Serilog.Filters;
using Microsoft.AspNetCore.Http.Features;
using RealEstate.API.Hubs;
// using RealEstate.API.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Infrastructure Services
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));

// Redis Cache
builder.Services.AddStackExchangeRedisCache(options =>
{
  options.Configuration = builder.Configuration.GetConnectionString("RedisConnection");
  options.InstanceName = "RealEstateAPI:";
});

// CORS Configuration for SignalR
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSignalR", policy =>
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "https://localhost:3000", "https://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

// Identity Configuration
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
  options.Password.RequireDigit = true;
  options.Password.RequiredLength = 8;
  options.Password.RequireLowercase = true;
  options.Password.RequireUppercase = true;
  options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Authentication Configuration
builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
})
// AddJwtBearer configuration
.AddJwtBearer(options =>
{
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = builder.Configuration["Jwt:Issuer"],
    ValidAudience = builder.Configuration["Jwt:Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
  };
  options.Events = new JwtBearerEvents
  {
    OnMessageReceived = context =>
    {
      // SignalR WebSocket/SSE: token query string ile gelir
      var path = context.HttpContext.Request.Path;
      var accessToken = context.Request.Query["access_token"];
      if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chathub"))
      {
        context.Token = accessToken;
        return Task.CompletedTask;
      }

      // Normal HTTP: Authorization header
      var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
      if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
      {
        context.Token = authHeader["Bearer ".Length..].Trim();
      }
      return Task.CompletedTask;
    }
  };
});

// Cycle Detection
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
    );

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
  c.SwaggerDoc("v1", new OpenApiInfo { Title = "RealEstate API V1", Version = "v1" });

  // JWT Bearer Token Support
  c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
  {
    Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
    Name = "Authorization",
    In = ParameterLocation.Header,
    Type = SecuritySchemeType.ApiKey,
    Scheme = "Bearer"
  });

  c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Serilog configuration
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()

    // Framework Logs
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(Matching.FromSource("Microsoft"))
        .WriteTo.File("../Logs/Framework-logs/framework.txt", rollingInterval: RollingInterval.Day))

    // API Logs
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(le =>
            le.Properties.ContainsKey("SourceContext") &&
            le.Properties["SourceContext"].ToString().Contains("RealEstate.API"))
        .WriteTo.File("../Logs/API-logs/api.txt", rollingInterval: RollingInterval.Day))

    // Infrastructure Logs
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(le =>
            le.Properties.ContainsKey("SourceContext") &&
            le.Properties["SourceContext"].ToString().Contains("RealEstate.Infrastructure"))
        .WriteTo.File("../Logs/Infrastructure-logs/infrastructure.txt", rollingInterval: RollingInterval.Day))

    // Application Logs
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(le =>
            le.Properties.ContainsKey("SourceContext") &&
            le.Properties["SourceContext"].ToString().Contains("RealEstate.Application"))
        .WriteTo.File("../Logs/Application-logs/application.txt", rollingInterval: RollingInterval.Day))

    // Domain Logs
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(le =>
            le.Properties.ContainsKey("SourceContext") &&
            le.Properties["SourceContext"].ToString().Contains("RealEstate.Domain"))
        .WriteTo.File("Logs/domain.txt", rollingInterval: RollingInterval.Day))

    .CreateLogger();
builder.Host.UseSerilog();

// Application & Infrastructure Services
builder.Services.Configure<FormOptions>(options =>
{
  options.MultipartBodyLengthLimit = 100 * 1024 * 1024; // 100 MB
});
builder.Services.AddAutoMapper(typeof(MappingProfile));
// Account Services
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Admin Service
builder.Services.AddScoped<IAdminService, AdminService>();

// Property Services
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<IGeocodingService, GeocodingService>();
builder.Services.AddHttpClient<IGeocodingService, GeocodingService>();

// Property Lookup Services
builder.Services.AddScoped<IPropertyLookupService, PropertyLookupService>();
builder.Services.AddScoped<IPropertyLookupRepository, PropertyLookupRepository>();

// Favorite Services
builder.Services.AddScoped<IFavoriteService, FavoriteService>();
builder.Services.AddScoped<IFavoriteRepository, FavoriteRepository>();

// Chat Services
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
});
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IChatRepository, ChatRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
  app.ApplyMigrations();
}

// app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

// app.UseCors(policy =>
//     policy.AllowAnyOrigin()
//           .AllowAnyMethod()
//           .AllowAnyHeader()
//           .AllowCredentials());
app.UseCors("AllowSignalR");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");

app.MapGet("/", () => "Welcome to the RealEstate API!");

app.Run();

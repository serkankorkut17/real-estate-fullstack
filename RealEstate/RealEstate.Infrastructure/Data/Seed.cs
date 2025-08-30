using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Data
{
    public class Seed
    {
        public static void SeedData(ModelBuilder modelBuilder)
        {
            // Roles
            List<ApplicationRole> roles = new List<ApplicationRole>
            {
                new ApplicationRole { Id = 1, Name = "Admin", NormalizedName = "ADMIN", Description = "Administrator role", CreatedDate = DateTime.UtcNow },
                new ApplicationRole { Id = 2, Name = "User", NormalizedName = "USER", Description = "Regular user role", CreatedDate = DateTime.UtcNow }
            };

            // Users (passwords should be hashed)
            var passwordHasher = new PasswordHasher<ApplicationUser>();
            List<ApplicationUser> users = new List<ApplicationUser>
            {
                new ApplicationUser
                {
                    Id = 1,
                    UserName = "admin",
                    NormalizedUserName = "ADMIN",
                    Email = "info@admin.com",
                    NormalizedEmail = "INFO@ADMIN.COM",
                    PhoneNumber = "05361234567",
                    FirstName = "Admin",
                    LastName = "User",
                    ProfilePictureUrl = "https://res.cloudinary.com/realestatefiledb/image/upload/v1728541507/samples/smile.jpg",
                    CreatedDate = DateTime.UtcNow,
                    EmailConfirmed = true,
                    SecurityStamp = Guid.NewGuid().ToString()
                },
                new ApplicationUser
                {
                    Id = 2,
                    UserName = "user",
                    NormalizedUserName = "USER",
                    Email = "info@user.com",
                    NormalizedEmail = "INFO@USER.COM",
                    PhoneNumber = "05361234567",
                    FirstName = "Regular",
                    LastName = "User",
                    ProfilePictureUrl = "https://res.cloudinary.com/realestatefiledb/image/upload/v1728541508/samples/man-portrait.jpg",
                    CreatedDate = DateTime.UtcNow,
                    EmailConfirmed = true,
                    SecurityStamp = Guid.NewGuid().ToString()
                }
            };

            // Hash passwords
            users[0].PasswordHash = passwordHasher.HashPassword(users[0], "AdminUser123");
            users[1].PasswordHash = passwordHasher.HashPassword(users[1], "NormalUser123");

            // User-Role relationships
            List<IdentityUserRole<int>> userRoles = new List<IdentityUserRole<int>>
            {
                new IdentityUserRole<int> { UserId = 1, RoleId = 1 }, // Admin -> Admin role
                new IdentityUserRole<int> { UserId = 2, RoleId = 2 }  // User -> User role
            };

            // Seed data
            modelBuilder.Entity<ApplicationRole>().HasData(roles);
            modelBuilder.Entity<ApplicationUser>().HasData(users);
            modelBuilder.Entity<IdentityUserRole<int>>().HasData(userRoles);

            // Currency Seed Data
            modelBuilder.Entity<Currency>().HasData(
                new Currency { Id = 1, Code = "TRY", Name = "Turkish Lira", Symbol = "₺" },
                new Currency { Id = 2, Code = "USD", Name = "US Dollar", Symbol = "$" },
                new Currency { Id = 3, Code = "EUR", Name = "Euro", Symbol = "€" }
            );

            // PropertyStatus Seed Data
            modelBuilder.Entity<PropertyStatus>().HasData(
                new PropertyStatus { Id = 1, Name = "For Sale" },
                new PropertyStatus { Id = 2, Name = "For Rent" }
                // new PropertyStatus { Id = 3, Name = "Sold" },
                // new PropertyStatus { Id = 4, Name = "Rented" }
            );

            // PropertyType Seed Data
            modelBuilder.Entity<PropertyType>().HasData(
                new PropertyType { Id = 1, Name = "Apartment", CreatedDate = DateTime.UtcNow },
                new PropertyType { Id = 2, Name = "Villa", CreatedDate = DateTime.UtcNow },
                new PropertyType { Id = 3, Name = "Office", CreatedDate = DateTime.UtcNow },
                new PropertyType { Id = 4, Name = "Land", CreatedDate = DateTime.UtcNow },
                new PropertyType { Id = 5, Name = "Detached House", CreatedDate = DateTime.UtcNow },
                new PropertyType { Id = 6, Name = "Building", CreatedDate = DateTime.UtcNow },
                new PropertyType { Id = 7, Name = "Timeshare", CreatedDate = DateTime.UtcNow },
                new PropertyType { Id = 8, Name = "Touristic Facility", CreatedDate = DateTime.UtcNow }
            );
        }
    }
}
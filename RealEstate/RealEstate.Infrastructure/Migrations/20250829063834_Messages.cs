using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RealEstate.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Messages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SenderId = table.Column<int>(type: "integer", nullable: false),
                    ReceiverId = table.Column<int>(type: "integer", nullable: false),
                    PropertyId = table.Column<int>(type: "integer", nullable: true),
                    Content = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_AspNetUsers_ReceiverId",
                        column: x => x.ReceiverId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Messages_AspNetUsers_SenderId",
                        column: x => x.SenderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Messages_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 6, 38, 34, 622, DateTimeKind.Utc).AddTicks(4370));

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 6, 38, 34, 622, DateTimeKind.Utc).AddTicks(4380));

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "CreatedDate", "PasswordHash", "SecurityStamp" },
                values: new object[] { "e2d1d9ee-48ed-4777-918e-8c04f44e5201", new DateTime(2025, 8, 29, 6, 38, 34, 622, DateTimeKind.Utc).AddTicks(4470), "AQAAAAIAAYagAAAAEL5nxg5RSKCbdp48CaiHhcGLs9dXSL+t1ZbNxHJ15v5OeOdhqPmBIEUJy2EnAh2HXg==", "140713ad-5569-4d76-8037-ba838b515d86" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "CreatedDate", "PasswordHash", "SecurityStamp" },
                values: new object[] { "856971fe-6910-4f86-9953-983bfa753cc2", new DateTime(2025, 8, 29, 6, 38, 34, 622, DateTimeKind.Utc).AddTicks(4480), "AQAAAAIAAYagAAAAEHJxVHREftubJ7lBXZBE81IIjWQATQF/DjY5Pdt4pyQGOtrfth8/VbN8sUhqHXzLHA==", "36cd9679-92a0-4c98-b0b8-a28744c25ccc" });

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 6, 38, 34, 694, DateTimeKind.Utc).AddTicks(360));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 6, 38, 34, 694, DateTimeKind.Utc).AddTicks(360));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 6, 38, 34, 694, DateTimeKind.Utc).AddTicks(360));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 6, 38, 34, 694, DateTimeKind.Utc).AddTicks(360));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 6, 38, 34, 694, DateTimeKind.Utc).AddTicks(360));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 6, 38, 34, 694, DateTimeKind.Utc).AddTicks(360));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 6, 38, 34, 694, DateTimeKind.Utc).AddTicks(360));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 6, 38, 34, 694, DateTimeKind.Utc).AddTicks(360));

            migrationBuilder.CreateIndex(
                name: "IX_Messages_PropertyId",
                table: "Messages",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ReceiverId",
                table: "Messages",
                column: "ReceiverId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_SenderId_ReceiverId_PropertyId_CreatedAt",
                table: "Messages",
                columns: new[] { "SenderId", "ReceiverId", "PropertyId", "CreatedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 22, 9, 47, 22, 870, DateTimeKind.Utc).AddTicks(6570));

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 22, 9, 47, 22, 870, DateTimeKind.Utc).AddTicks(6580));

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "CreatedDate", "PasswordHash", "SecurityStamp" },
                values: new object[] { "db6d65e3-6f39-428c-a53e-84f941d6188e", new DateTime(2025, 8, 22, 9, 47, 22, 870, DateTimeKind.Utc).AddTicks(6650), "AQAAAAIAAYagAAAAENRlvwEyLVY8bRqH3I1iaKMo0ovxpQaJ7sDP3QT7EOJYkpUFrE60KYgWz3/0xmszUA==", "749c1acc-c8ac-403b-a167-c3fc07d0e1e3" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "CreatedDate", "PasswordHash", "SecurityStamp" },
                values: new object[] { "6f8518b5-c530-459c-9bcb-9686bb7e19d6", new DateTime(2025, 8, 22, 9, 47, 22, 870, DateTimeKind.Utc).AddTicks(6660), "AQAAAAIAAYagAAAAEKbmXepVtac1WoyZpDVO6S66nt23O8B43rorTvXoIKYl/qhXOi/5HYyEC1yBXeIPNw==", "9433a479-ada9-4253-a34e-25d5ba57e707" });

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 22, 9, 47, 22, 946, DateTimeKind.Utc).AddTicks(9020));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 22, 9, 47, 22, 946, DateTimeKind.Utc).AddTicks(9020));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 22, 9, 47, 22, 946, DateTimeKind.Utc).AddTicks(9020));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 22, 9, 47, 22, 946, DateTimeKind.Utc).AddTicks(9020));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 22, 9, 47, 22, 946, DateTimeKind.Utc).AddTicks(9020));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 22, 9, 47, 22, 946, DateTimeKind.Utc).AddTicks(9020));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 22, 9, 47, 22, 946, DateTimeKind.Utc).AddTicks(9020));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 22, 9, 47, 22, 946, DateTimeKind.Utc).AddTicks(9030));
        }
    }
}

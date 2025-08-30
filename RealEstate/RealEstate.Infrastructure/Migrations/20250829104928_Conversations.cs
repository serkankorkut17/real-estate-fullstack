using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RealEstate.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Conversations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Properties_PropertyId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_PropertyId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_SenderId_ReceiverId_PropertyId_CreatedAt",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "PropertyId",
                table: "Messages");

            migrationBuilder.AddColumn<int>(
                name: "ConversationId",
                table: "Messages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Conversations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserAId = table.Column<int>(type: "integer", nullable: false),
                    UserBId = table.Column<int>(type: "integer", nullable: false),
                    SmallerUserId = table.Column<int>(type: "integer", nullable: false),
                    LargerUserId = table.Column<int>(type: "integer", nullable: false),
                    PropertyId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastMessageAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversations", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 10, 49, 28, 191, DateTimeKind.Utc).AddTicks(7180));

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 10, 49, 28, 191, DateTimeKind.Utc).AddTicks(7180));

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "CreatedDate", "PasswordHash", "SecurityStamp" },
                values: new object[] { "edf520f8-c9bc-403d-94dd-db07e420bce0", new DateTime(2025, 8, 29, 10, 49, 28, 191, DateTimeKind.Utc).AddTicks(7230), "AQAAAAIAAYagAAAAED9/1LII+Q01j8epfCJ5sbT2c1Emq+79ZmnqTNYrNyCGRWAzXTp2e8EzEyU1L6jqJQ==", "e1a718b3-ee71-465f-858d-036ddf20f05a" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "CreatedDate", "PasswordHash", "SecurityStamp" },
                values: new object[] { "d2506d58-4266-4958-a1c3-e0bfaa7c1080", new DateTime(2025, 8, 29, 10, 49, 28, 191, DateTimeKind.Utc).AddTicks(7240), "AQAAAAIAAYagAAAAEAVNMx0P2nSwqvgmkh80EhzLtazJACfx7I45W5qwXeCbq75d6Faa52iezXGxWRX4gw==", "be941224-7b46-44a4-ab32-760500136586" });

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 10, 49, 28, 267, DateTimeKind.Utc).AddTicks(8950));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 10, 49, 28, 267, DateTimeKind.Utc).AddTicks(8960));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 10, 49, 28, 267, DateTimeKind.Utc).AddTicks(8960));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 10, 49, 28, 267, DateTimeKind.Utc).AddTicks(8960));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 10, 49, 28, 267, DateTimeKind.Utc).AddTicks(8960));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 10, 49, 28, 267, DateTimeKind.Utc).AddTicks(8960));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 10, 49, 28, 267, DateTimeKind.Utc).AddTicks(8960));

            migrationBuilder.UpdateData(
                table: "PropertyTypes",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedDate",
                value: new DateTime(2025, 8, 29, 10, 49, 28, 267, DateTimeKind.Utc).AddTicks(8960));

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ConversationId_CreatedAt",
                table: "Messages",
                columns: new[] { "ConversationId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_SenderId",
                table: "Messages",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_SmallerUserId_LargerUserId_PropertyId",
                table: "Conversations",
                columns: new[] { "SmallerUserId", "LargerUserId", "PropertyId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Conversations_ConversationId",
                table: "Messages",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Conversations_ConversationId",
                table: "Messages");

            migrationBuilder.DropTable(
                name: "Conversations");

            migrationBuilder.DropIndex(
                name: "IX_Messages_ConversationId_CreatedAt",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_SenderId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "ConversationId",
                table: "Messages");

            migrationBuilder.AddColumn<int>(
                name: "PropertyId",
                table: "Messages",
                type: "integer",
                nullable: true);

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
                name: "IX_Messages_SenderId_ReceiverId_PropertyId_CreatedAt",
                table: "Messages",
                columns: new[] { "SenderId", "ReceiverId", "PropertyId", "CreatedAt" });

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Properties_PropertyId",
                table: "Messages",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}

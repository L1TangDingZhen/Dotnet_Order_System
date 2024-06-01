using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Order.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMenuComment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "Orders");

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "Menus",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "Menus");

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "Orders",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}

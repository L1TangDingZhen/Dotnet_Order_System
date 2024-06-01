using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Order.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOrderItemAndTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfTables",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "TableNumber",
                table: "Orders",
                newName: "TableId");

            migrationBuilder.CreateTable(
                name: "Tables",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TableName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsAvailable = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tables", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_TableId",
                table: "Orders",
                column: "TableId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Tables_TableId",
                table: "Orders",
                column: "TableId",
                principalTable: "Tables",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Tables_TableId",
                table: "Orders");

            migrationBuilder.DropTable(
                name: "Tables");

            migrationBuilder.DropIndex(
                name: "IX_Orders_TableId",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "TableId",
                table: "Orders",
                newName: "TableNumber");

            migrationBuilder.AddColumn<int>(
                name: "NumberOfTables",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}

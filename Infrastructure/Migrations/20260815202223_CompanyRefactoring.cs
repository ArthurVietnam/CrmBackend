using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrmPridnestrovye.Migrations
{
    /// <inheritdoc />
    public partial class CompanyRefactoring : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Company");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Company",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}

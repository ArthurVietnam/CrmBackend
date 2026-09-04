using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrmPridnestrovye.Migrations
{
    /// <inheritdoc />
    public partial class ServiceNullable2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderServices_Services_ServiceId",
                table: "OrderServices");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderServices_Services_ServiceId",
                table: "OrderServices",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderServices_Services_ServiceId",
                table: "OrderServices");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderServices_Services_ServiceId",
                table: "OrderServices",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrmPridnestrovye.Migrations
{
    /// <inheritdoc />
    public partial class ServiceNull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_Services_ServiceId",
                table: "Appointment");

            migrationBuilder.CreateIndex(
                name: "IX_Company_Email",
                table: "Company",
                column: "Email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_Services_ServiceId",
                table: "Appointment",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_Services_ServiceId",
                table: "Appointment");

            migrationBuilder.DropIndex(
                name: "IX_Company_Email",
                table: "Company");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_Services_ServiceId",
                table: "Appointment",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

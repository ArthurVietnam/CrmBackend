using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrmPridnestrovye.Migrations
{
    /// <inheritdoc />
    public partial class AppointmentService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_Services_ServiceId",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderServices_Company_CompanyId",
                table: "OrderServices");

            migrationBuilder.DropIndex(
                name: "IX_OrderServices_CompanyId",
                table: "OrderServices");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "OrderServices");

            migrationBuilder.CreateTable(
                name: "AppointmentService",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AppointmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceId = table.Column<Guid>(type: "uuid", nullable: true),
                    Count = table.Column<long>(type: "bigint", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentService", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentService_Appointment_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointment",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppointmentService_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentService_AppointmentId",
                table: "AppointmentService",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentService_ServiceId",
                table: "AppointmentService",
                column: "ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_Services_ServiceId",
                table: "Appointment",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_Services_ServiceId",
                table: "Appointment");

            migrationBuilder.DropTable(
                name: "AppointmentService");

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "OrderServices",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderServices_CompanyId",
                table: "OrderServices",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_Services_ServiceId",
                table: "Appointment",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderServices_Company_CompanyId",
                table: "OrderServices",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id");
        }
    }
}

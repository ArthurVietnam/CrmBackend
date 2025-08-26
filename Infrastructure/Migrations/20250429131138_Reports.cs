using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrmPridnestrovye.Migrations
{
    /// <inheritdoc />
    public partial class Reports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_Client_ClientId",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_Service_ServiceId",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_Client_Company_CompanyId",
                table: "Client");

            migrationBuilder.DropForeignKey(
                name: "FK_Order_Client_ClientId",
                table: "Order");

            migrationBuilder.DropForeignKey(
                name: "FK_Order_Company_CompanyId",
                table: "Order");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderService_Company_CompanyId",
                table: "OrderService");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderService_Order_OrderId",
                table: "OrderService");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderService_Service_ServiceId",
                table: "OrderService");

            migrationBuilder.DropForeignKey(
                name: "FK_Service_Company_CompanyId",
                table: "Service");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Service",
                table: "Service");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderService",
                table: "OrderService");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Order",
                table: "Order");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Client",
                table: "Client");

            migrationBuilder.RenameTable(
                name: "Service",
                newName: "Services");

            migrationBuilder.RenameTable(
                name: "OrderService",
                newName: "OrderServices");

            migrationBuilder.RenameTable(
                name: "Order",
                newName: "Orders");

            migrationBuilder.RenameTable(
                name: "Client",
                newName: "Clients");

            migrationBuilder.RenameIndex(
                name: "IX_Service_CompanyId",
                table: "Services",
                newName: "IX_Services_CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderService_ServiceId",
                table: "OrderServices",
                newName: "IX_OrderServices_ServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderService_OrderId",
                table: "OrderServices",
                newName: "IX_OrderServices_OrderId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderService_CompanyId",
                table: "OrderServices",
                newName: "IX_OrderServices_CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_Order_CompanyId",
                table: "Orders",
                newName: "IX_Orders_CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_Order_ClientId",
                table: "Orders",
                newName: "IX_Orders_ClientId");

            migrationBuilder.RenameIndex(
                name: "IX_Client_CompanyId",
                table: "Clients",
                newName: "IX_Clients_CompanyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Services",
                table: "Services",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderServices",
                table: "OrderServices",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Orders",
                table: "Orders",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Clients",
                table: "Clients",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_Clients_ClientId",
                table: "Appointment",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_Services_ServiceId",
                table: "Appointment",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Company_CompanyId",
                table: "Clients",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Clients_ClientId",
                table: "Orders",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Company_CompanyId",
                table: "Orders",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderServices_Company_CompanyId",
                table: "OrderServices",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderServices_Orders_OrderId",
                table: "OrderServices",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderServices_Services_ServiceId",
                table: "OrderServices",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Services_Company_CompanyId",
                table: "Services",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_Clients_ClientId",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_Services_ServiceId",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Company_CompanyId",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Clients_ClientId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Company_CompanyId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderServices_Company_CompanyId",
                table: "OrderServices");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderServices_Orders_OrderId",
                table: "OrderServices");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderServices_Services_ServiceId",
                table: "OrderServices");

            migrationBuilder.DropForeignKey(
                name: "FK_Services_Company_CompanyId",
                table: "Services");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Services",
                table: "Services");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderServices",
                table: "OrderServices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Orders",
                table: "Orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Clients",
                table: "Clients");

            migrationBuilder.RenameTable(
                name: "Services",
                newName: "Service");

            migrationBuilder.RenameTable(
                name: "OrderServices",
                newName: "OrderService");

            migrationBuilder.RenameTable(
                name: "Orders",
                newName: "Order");

            migrationBuilder.RenameTable(
                name: "Clients",
                newName: "Client");

            migrationBuilder.RenameIndex(
                name: "IX_Services_CompanyId",
                table: "Service",
                newName: "IX_Service_CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderServices_ServiceId",
                table: "OrderService",
                newName: "IX_OrderService_ServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderServices_OrderId",
                table: "OrderService",
                newName: "IX_OrderService_OrderId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderServices_CompanyId",
                table: "OrderService",
                newName: "IX_OrderService_CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_CompanyId",
                table: "Order",
                newName: "IX_Order_CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_ClientId",
                table: "Order",
                newName: "IX_Order_ClientId");

            migrationBuilder.RenameIndex(
                name: "IX_Clients_CompanyId",
                table: "Client",
                newName: "IX_Client_CompanyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Service",
                table: "Service",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderService",
                table: "OrderService",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Order",
                table: "Order",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Client",
                table: "Client",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_Client_ClientId",
                table: "Appointment",
                column: "ClientId",
                principalTable: "Client",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_Service_ServiceId",
                table: "Appointment",
                column: "ServiceId",
                principalTable: "Service",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Client_Company_CompanyId",
                table: "Client",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Client_ClientId",
                table: "Order",
                column: "ClientId",
                principalTable: "Client",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Company_CompanyId",
                table: "Order",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderService_Company_CompanyId",
                table: "OrderService",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderService_Order_OrderId",
                table: "OrderService",
                column: "OrderId",
                principalTable: "Order",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderService_Service_ServiceId",
                table: "OrderService",
                column: "ServiceId",
                principalTable: "Service",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Service_Company_CompanyId",
                table: "Service",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

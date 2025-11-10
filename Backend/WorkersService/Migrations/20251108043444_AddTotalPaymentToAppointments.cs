using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkersService.Migrations
{
    /// <inheritdoc />
    public partial class AddTotalPaymentToAppointments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalPayment",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalPayment",
                table: "Appointments");
        }
    }
}

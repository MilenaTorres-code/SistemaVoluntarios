using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaVoluntarios.Api.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarNumeroCadastro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumeroCadastro",
                table: "voluntarios",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumeroCadastro",
                table: "voluntarios");
        }
    }
}

using System.ComponentModel.DataAnnotations;

namespace SistemaVoluntarios.Api.Models;

public class Usuarios
{
    public int Id { get; set; }

    [Required]
    public string Nome { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string SenhaHash { get; set; } = string.Empty;

    public DateTime CriadoEm { get; set; }
}

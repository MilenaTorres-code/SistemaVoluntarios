using System.ComponentModel.DataAnnotations;

namespace SistemaVoluntarios.Api.Models;

public class Voluntarios
{
    public int Id { get; set; }

    public int NumeroCadastro { get; set; }

    [Required(ErrorMessage = "O nome do voluntário é obrigatório.")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "O CPF do voluntário é obrigatório.")]
    public string Cpf { get; set; } = string.Empty;

    public string Celular { get; set; } = string.Empty;

    public string Endereco { get; set; } = string.Empty;

    public DateTime DataNascimento { get; set; }

    public string Sexo { get; set; } = string.Empty;

    public bool Ativo { get; set; } = true;

    public DateTime CriadoEm { get; set; }

    public DateTime? AtualizadoEm { get; set; }
}
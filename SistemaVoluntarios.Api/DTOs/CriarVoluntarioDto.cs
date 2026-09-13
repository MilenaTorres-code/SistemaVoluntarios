using System.ComponentModel.DataAnnotations;

namespace SistemaVoluntarios.Api.DTOs;

public class CriarVoluntarioDto
{
    [Range(1, int.MaxValue, ErrorMessage = "O número de cadastro deve ser informado.")]
    public int NumeroCadastro { get; set; }

    [Required(ErrorMessage = "O nome do voluntário é obrigatório.")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "O CPF do voluntário é obrigatório.")]
    public string Cpf { get; set; } = string.Empty;

    public string Celular { get; set; } = string.Empty;

    public string Endereco { get; set; } = string.Empty;

    public DateTime DataNascimento { get; set; }

    public string Sexo { get; set; } = string.Empty;
}
using System.ComponentModel.DataAnnotations;

namespace SistemaVoluntarios.Api.DTOs;

public class RegistrarPresencaDto
{
    [Range(1, int.MaxValue, ErrorMessage = "O voluntário deve ser informado.")]
    public int VoluntarioId { get; set; }

    [Required(ErrorMessage = "A data da presença deve ser informada.")]
    public DateTime? Data { get; set; }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaVoluntarios.Api.Models;

public class Presencas
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int VoluntarioId { get; set; }

    [Required]
    public DateTime Data { get; set; }

    public DateTime CriadoEm { get; set; }

    [ForeignKey("VoluntarioId")]
    public Voluntarios? Voluntario { get; set; }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaVoluntarios.Api.Data;
using SistemaVoluntarios.Api.Models;

namespace SistemaVoluntarios.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PresencasController : ControllerBase
{
    private readonly AppDbContext _context;

    public PresencasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> ListarPorData(DateTime data)
    {
        var dataSelecionada = data.Date;

        var presencas = await _context.Presencas
            .Where(p => p.Data.Date == dataSelecionada)
            .Include(p => p.Voluntario)
            .OrderBy(p => p.Voluntario!.Nome)
            .Select(p => new
            {
                p.Id,
                p.VoluntarioId,
                Nome = p.Voluntario!.Nome,
                Sexo = p.Voluntario.Sexo,
                NumeroCadastro = p.Voluntario.NumeroCadastro,
                Data = p.Data
            })
            .ToListAsync();

        return Ok(presencas);
    }

    [HttpPost]
    public async Task<IActionResult> Registrar(Presencas presenca)
    {
        if (presenca.VoluntarioId <= 0)
            return BadRequest("O voluntário deve ser informado.");

        if (presenca.Data == default)
            return BadRequest("A data da presença deve ser informada.");

        var voluntario = await _context.Voluntarios
            .FirstOrDefaultAsync(v => v.Id == presenca.VoluntarioId);

        if (voluntario == null)
            return NotFound("Voluntário não encontrado.");

        if (!voluntario.Ativo)
            return BadRequest("Não é possível registrar presença para um voluntário inativo.");

        var dataSelecionada = presenca.Data.Date;

        var jaExiste = await _context.Presencas
            .AnyAsync(p =>
                p.VoluntarioId == presenca.VoluntarioId &&
                p.Data.Date == dataSelecionada);

        if (jaExiste)
            return Conflict("Este voluntário já possui presença registrada nesta data.");

        var novaPresenca = new Presencas
        {
            VoluntarioId = presenca.VoluntarioId,
            Data = dataSelecionada,
            CriadoEm = DateTime.Now
        };

        _context.Presencas.Add(novaPresenca);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            mensagem = "Presença registrada com sucesso.",
            presenca = new
            {
                novaPresenca.Id,
                novaPresenca.VoluntarioId,
                Nome = voluntario.Nome,
                Sexo = voluntario.Sexo,
                Data = novaPresenca.Data
            }
        });
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Remover(int id)
    {
        var presenca = await _context.Presencas
            .FirstOrDefaultAsync(p => p.Id == id);

        if (presenca == null)
            return NotFound("Presença não encontrada.");

        _context.Presencas.Remove(presenca);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            mensagem = "Presença removida com sucesso."
        });
    }
    [HttpGet("resumo")]
    public async Task<IActionResult> Resumo(DateTime data)
    {
        var dataSelecionada = data.Date;

        var presencas = await _context.Presencas
            .Where(p => p.Data.Date == dataSelecionada)
            .Include(p => p.Voluntario)
            .ToListAsync();

        var total = presencas.Count;

        var homens = presencas.Count(p =>
            p.Voluntario != null &&
            p.Voluntario.Sexo != null &&
            p.Voluntario.Sexo.ToLower() == "masculino");

        var mulheres = presencas.Count(p =>
            p.Voluntario != null &&
            p.Voluntario.Sexo != null &&
            p.Voluntario.Sexo.ToLower() == "feminino");

        return Ok(new
        {
            data = dataSelecionada,
            total,
            homens,
            mulheres
        });
    }

}
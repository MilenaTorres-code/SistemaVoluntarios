using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaVoluntarios.Api.Data;
using SistemaVoluntarios.Api.DTOs;
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
        var inicio = data.Date;
        var fim = inicio.AddDays(1);

        var presencas = await _context.Presencas
            .Where(p => p.Data >= inicio && p.Data < fim)
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

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var presenca = await _context.Presencas
            .Where(p => p.Id == id)
            .Select(p => new
            {
                p.Id,
                p.VoluntarioId,
                Nome = p.Voluntario!.Nome,
                Sexo = p.Voluntario.Sexo,
                NumeroCadastro = p.Voluntario.NumeroCadastro,
                Data = p.Data,
                p.CriadoEm
            })
            .FirstOrDefaultAsync();

        if (presenca == null)
            return NotFound("Presença não encontrada.");

        return Ok(presenca);
    }

    [HttpGet("voluntario/{voluntarioId:int}")]
    public async Task<IActionResult> ListarPorVoluntario(
        int voluntarioId,
        DateTime? inicio,
        DateTime? fim)
    {
        var voluntario = await _context.Voluntarios
            .FirstOrDefaultAsync(v => v.Id == voluntarioId);

        if (voluntario == null)
            return NotFound("Voluntário não encontrado.");

        var consulta = _context.Presencas
            .Where(p => p.VoluntarioId == voluntarioId);

        if (inicio.HasValue)
        {
            var dataInicio = inicio.Value.Date;
            consulta = consulta.Where(p => p.Data >= dataInicio);
        }

        if (fim.HasValue)
        {
            var dataFim = fim.Value.Date.AddDays(1);
            consulta = consulta.Where(p => p.Data < dataFim);
        }

        var presencas = await consulta
            .OrderByDescending(p => p.Data)
            .Select(p => new
            {
                p.Id,
                p.VoluntarioId,
                Data = p.Data
            })
            .ToListAsync();

        return Ok(new
        {
            voluntario = new
            {
                voluntario.Id,
                voluntario.NumeroCadastro,
                voluntario.Nome,
                voluntario.Ativo
            },
            total = presencas.Count,
            presencas
        });
    }

    [HttpPost]
    public async Task<IActionResult> Registrar(RegistrarPresencaDto dto)
    {
        if (dto.VoluntarioId <= 0)
            return BadRequest("O voluntário deve ser informado.");

        if (dto.Data == null || dto.Data == default(DateTime))
            return BadRequest("A data da presença deve ser informada.");

        var voluntario = await _context.Voluntarios
            .FirstOrDefaultAsync(v => v.Id == dto.VoluntarioId);

        if (voluntario == null)
            return NotFound("Voluntário não encontrado.");

        if (!voluntario.Ativo)
            return BadRequest("Não é possível registrar presença para um voluntário inativo.");

        var dataSelecionada = dto.Data.Value.Date;

        if (await JaExistePresenca(dto.VoluntarioId, dataSelecionada))
            return Conflict("Este voluntário já possui presença registrada nesta data.");

        var novaPresenca = new Presencas
        {
            VoluntarioId = dto.VoluntarioId,
            Data = dataSelecionada,
            CriadoEm = DateTime.Now
        };

        _context.Presencas.Add(novaPresenca);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(ObterPorId),
            new { id = novaPresenca.Id },
            new
            {
                mensagem = "Presença registrada com sucesso.",
                presenca = new
                {
                    novaPresenca.Id,
                    novaPresenca.VoluntarioId,
                    Nome = voluntario.Nome,
                    Sexo = voluntario.Sexo,
                    NumeroCadastro = voluntario.NumeroCadastro,
                    Data = novaPresenca.Data
                }
            });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(int id, AtualizarPresencaDto dto)
    {
        if (dto.VoluntarioId <= 0)
            return BadRequest("O voluntário deve ser informado.");

        if (dto.Data == null || dto.Data == default(DateTime))
            return BadRequest("A data da presença deve ser informada.");

        var presenca = await _context.Presencas
            .FirstOrDefaultAsync(p => p.Id == id);

        if (presenca == null)
            return NotFound("Presença não encontrada.");

        var voluntario = await _context.Voluntarios
            .FirstOrDefaultAsync(v => v.Id == dto.VoluntarioId);

        if (voluntario == null)
            return NotFound("Voluntário não encontrado.");

        if (!voluntario.Ativo && voluntario.Id != presenca.VoluntarioId)
            return BadRequest("Não é possível transferir a presença para um voluntário inativo.");

        var novaData = dto.Data.Value.Date;

        if (await JaExistePresenca(dto.VoluntarioId, novaData, ignorarId: id))
            return Conflict("Este voluntário já possui presença registrada nesta data.");

        presenca.VoluntarioId = dto.VoluntarioId;
        presenca.Data = novaData;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            mensagem = "Presença alterada com sucesso.",
            presenca = new
            {
                presenca.Id,
                presenca.VoluntarioId,
                Nome = voluntario.Nome,
                Sexo = voluntario.Sexo,
                NumeroCadastro = voluntario.NumeroCadastro,
                Data = presenca.Data
            }
        });
    }

    [HttpDelete("{id:int}")]
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
        var inicio = data.Date;
        var fim = inicio.AddDays(1);

        var sexos = await _context.Presencas
            .Where(p => p.Data >= inicio && p.Data < fim)
            .Select(p => p.Voluntario!.Sexo)
            .ToListAsync();

        var homens = sexos.Count(s =>
            string.Equals(s, "masculino", StringComparison.OrdinalIgnoreCase));

        var mulheres = sexos.Count(s =>
            string.Equals(s, "feminino", StringComparison.OrdinalIgnoreCase));

        return Ok(new
        {
            data = inicio,
            total = sexos.Count,
            homens,
            mulheres
        });
    }

    private Task<bool> JaExistePresenca(
        int voluntarioId,
        DateTime data,
        int? ignorarId = null)
    {
        var inicio = data.Date;
        var fim = inicio.AddDays(1);

        return _context.Presencas.AnyAsync(p =>
            p.VoluntarioId == voluntarioId &&
            p.Data >= inicio &&
            p.Data < fim &&
            (ignorarId == null || p.Id != ignorarId));
    }
}
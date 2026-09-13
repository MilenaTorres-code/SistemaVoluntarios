using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaVoluntarios.Api.Data;
using SistemaVoluntarios.Api.Models;
using SistemaVoluntarios.Api.DTOs;

namespace SistemaVoluntarios.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VoluntariosController : ControllerBase
{
    private readonly AppDbContext _context;

    public VoluntariosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Criar(CriarVoluntarioDto dto)
    {
        if (dto.NumeroCadastro <= 0)
        {
            return BadRequest("O número de cadastro deve ser informado.");
        }

        if (string.IsNullOrWhiteSpace(dto.Nome))
        {
            return BadRequest("O nome do voluntário é obrigatório.");
        }

        if (string.IsNullOrWhiteSpace(dto.Cpf))
        {
            return BadRequest("O CPF do voluntário é obrigatório.");
        }

        var cpfExiste = await _context.Voluntarios
            .AnyAsync(v => v.Cpf == dto.Cpf);

        if (cpfExiste)
        {
            return Conflict(
                "Já existe um voluntário cadastrado com este CPF.");
        }

        var voluntario = new Voluntarios
        {
            NumeroCadastro = dto.NumeroCadastro,
            Nome = dto.Nome,
            Cpf = dto.Cpf,
            Celular = dto.Celular,
            Endereco = dto.Endereco,
            DataNascimento = dto.DataNascimento,
            Sexo = dto.Sexo,
            Ativo = true,
            CriadoEm = DateTime.Now
        };

        _context.Voluntarios.Add(voluntario);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(ObterPorId),
            new { id = voluntario.Id },
            voluntario
        );
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var voluntarios = await _context.Voluntarios
            .OrderBy(v => v.Nome)
            .ToListAsync();

        return Ok(voluntarios);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var voluntario = await _context.Voluntarios
            .FirstOrDefaultAsync(v => v.Id == id);

        if (voluntario == null)
        {
            return NotFound("Voluntário não encontrado.");
        }

        return Ok(voluntario);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(
        int id,
        AtualizarVoluntarioDto dto)
    {
        if (dto.NumeroCadastro <= 0)
        {
            return BadRequest("O número de cadastro deve ser informado.");
        }

        if (string.IsNullOrWhiteSpace(dto.Nome))
        {
            return BadRequest("O nome do voluntário é obrigatório.");
        }

        if (string.IsNullOrWhiteSpace(dto.Cpf))
        {
            return BadRequest("O CPF do voluntário é obrigatório.");
        }

        var voluntarioExistente = await _context.Voluntarios
            .FirstOrDefaultAsync(v => v.Id == id);

        if (voluntarioExistente == null)
        {
            return NotFound("Voluntário não encontrado.");
        }

        var cpfExiste = await _context.Voluntarios
            .AnyAsync(v => v.Cpf == dto.Cpf && v.Id != id);

        if (cpfExiste)
        {
            return Conflict(
                "Já existe outro voluntário cadastrado com este CPF.");
        }

        voluntarioExistente.NumeroCadastro = dto.NumeroCadastro;
        voluntarioExistente.Nome = dto.Nome;
        voluntarioExistente.Cpf = dto.Cpf;
        voluntarioExistente.Celular = dto.Celular;
        voluntarioExistente.Endereco = dto.Endereco;
        voluntarioExistente.DataNascimento = dto.DataNascimento;
        voluntarioExistente.Sexo = dto.Sexo;
        voluntarioExistente.AtualizadoEm = DateTime.Now;

        await _context.SaveChangesAsync();

        return Ok(voluntarioExistente);
    }

    [HttpPatch("{id}/inativar")]
    public async Task<IActionResult> Inativar(int id)
    {
        var voluntario = await _context.Voluntarios
            .FirstOrDefaultAsync(v => v.Id == id);

        if (voluntario == null)
        {
            return NotFound("Voluntário não encontrado.");
        }

        voluntario.Ativo = false;
        voluntario.AtualizadoEm = DateTime.Now;

        await _context.SaveChangesAsync();

        return Ok(voluntario);
    }

    [HttpPatch("{id}/ativar")]
    public async Task<IActionResult> Ativar(int id)
    {
        var voluntario = await _context.Voluntarios
            .FirstOrDefaultAsync(v => v.Id == id);

        if (voluntario == null)
        {
            return NotFound("Voluntário não encontrado.");
        }

        voluntario.Ativo = true;
        voluntario.AtualizadoEm = DateTime.Now;

        await _context.SaveChangesAsync();

        return Ok(voluntario);
    }

    [HttpGet("buscar")]
    public async Task<IActionResult> BuscarPorNome(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome))
            return BadRequest("Informe o nome do voluntário.");

        var voluntarios = await _context.Voluntarios
            .Where(v => v.Nome.Contains(nome))
            .OrderBy(v => v.Nome)
            .Select(v => new
            {
                v.Id,
                v.NumeroCadastro,
                v.Nome,
                v.Cpf,
                v.Celular,
                v.Ativo
            })
            .ToListAsync();

        return Ok(voluntarios);
    }
}
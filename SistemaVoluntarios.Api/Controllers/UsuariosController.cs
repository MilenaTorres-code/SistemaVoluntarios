using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaVoluntarios.Api.Data;

namespace SistemaVoluntarios.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsuariosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var usuarios = await _context.Usuarios
            .OrderBy(u => u.Nome)
            .Select(u => new
            {
                u.Id,
                u.Nome,
                u.Email,
                u.CriadoEm
            })
            .ToListAsync();

        return Ok(usuarios);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var usuarioLogado = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (usuarioLogado == id.ToString())
        {
            return BadRequest("Você não pode excluir a sua própria conta.");
        }

        var usuario = await _context.Usuarios.FindAsync(id);

        if (usuario == null)
        {
            return NotFound("Usuário não encontrado.");
        }

        _context.Usuarios.Remove(usuario);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}

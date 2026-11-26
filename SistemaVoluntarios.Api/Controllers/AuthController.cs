using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SistemaVoluntarios.Api.Data;
using SistemaVoluntarios.Api.DTOs;
using SistemaVoluntarios.Api.Models;

namespace SistemaVoluntarios.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<Usuarios> _hasher = new();

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("cadastrar")]
    public async Task<IActionResult> Cadastrar(CriarUsuarioDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome) ||
            string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Senha))
        {
            return BadRequest("Nome, e-mail e senha são obrigatórios.");
        }

        if (dto.Senha.Length < 6)
        {
            return BadRequest("A senha deve ter pelo menos 6 caracteres.");
        }

        var existeUsuario = await _context.Usuarios.AnyAsync();

        if (existeUsuario && User.Identity?.IsAuthenticated != true)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                "Novas contas só podem ser criadas por um usuário logado.");
        }

        var email = dto.Email.Trim().ToLower();

        var emailExiste = await _context.Usuarios
            .AnyAsync(u => u.Email == email);

        if (emailExiste)
        {
            return Conflict("Já existe um usuário cadastrado com este e-mail.");
        }

        var usuario = new Usuarios
        {
            Nome = dto.Nome.Trim(),
            Email = email,
            CriadoEm = DateTime.Now
        };

        usuario.SenhaHash = _hasher.HashPassword(usuario, dto.Senha);

        _context.Usuarios.Add(usuario);

        await _context.SaveChangesAsync();

        return Created(string.Empty, new
        {
            usuario.Id,
            usuario.Nome,
            usuario.Email
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Senha))
        {
            return BadRequest("Informe o e-mail e a senha.");
        }

        var email = dto.Email.Trim().ToLower();

        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email);

        if (usuario == null)
        {
            return Unauthorized("E-mail ou senha inválidos.");
        }

        var resultado = _hasher.VerifyHashedPassword(
            usuario,
            usuario.SenhaHash,
            dto.Senha);

        if (resultado == PasswordVerificationResult.Failed)
        {
            return Unauthorized("E-mail ou senha inválidos.");
        }

        return Ok(new
        {
            usuario.Id,
            usuario.Nome,
            usuario.Email,
            token = GerarToken(usuario)
        });
    }

    private string GerarToken(Usuarios usuario)
    {
        var chave = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Chave"]!));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, usuario.Nome),
            new Claim(ClaimTypes.Email, usuario.Email)
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: new SigningCredentials(
                chave,
                SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

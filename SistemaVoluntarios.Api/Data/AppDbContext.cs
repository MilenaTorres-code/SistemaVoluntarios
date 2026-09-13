using Microsoft.EntityFrameworkCore;
using SistemaVoluntarios.Api.Models;

namespace SistemaVoluntarios.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Voluntarios> Voluntarios => Set<Voluntarios>();

    public DbSet<Presencas> Presencas => Set<Presencas>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Voluntarios>()
            .ToTable("voluntarios");

        modelBuilder.Entity<Voluntarios>()
            .HasIndex(v => v.Cpf)
            .IsUnique();

        modelBuilder.Entity<Voluntarios>()
            .Property(v => v.Nome)
            .HasColumnName("nome");

        modelBuilder.Entity<Voluntarios>()
            .Property(v => v.Cpf)
            .HasColumnName("cpf");

        modelBuilder.Entity<Voluntarios>()
            .Property(v => v.Celular)
            .HasColumnName("celular");

        modelBuilder.Entity<Voluntarios>()
            .Property(v => v.Endereco)
            .HasColumnName("endereco");

        modelBuilder.Entity<Voluntarios>()
            .Property(v => v.DataNascimento)
            .HasColumnName("data_nascimento");

        modelBuilder.Entity<Voluntarios>()
            .Property(v => v.Sexo)
            .HasColumnName("sexo");

        modelBuilder.Entity<Voluntarios>()
            .Property(v => v.Ativo)
            .HasColumnName("ativo");

        modelBuilder.Entity<Voluntarios>()
            .Property(v => v.CriadoEm)
            .HasColumnName("criado_em");

        modelBuilder.Entity<Voluntarios>()
            .Property(v => v.AtualizadoEm)
            .HasColumnName("atualizado_em");

        modelBuilder.Entity<Presencas>()
            .ToTable("presencas");

        modelBuilder.Entity<Presencas>()
            .HasOne(p => p.Voluntario)
            .WithMany()
            .HasForeignKey(p => p.VoluntarioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Presencas>()
            .HasIndex(p => new { p.VoluntarioId, p.Data })
            .IsUnique();

        modelBuilder.Entity<Presencas>()
            .Property(p => p.VoluntarioId)
            .HasColumnName("voluntario_id");

        modelBuilder.Entity<Presencas>()
            .Property(p => p.Data)
            .HasColumnName("data");

        modelBuilder.Entity<Presencas>()
            .Property(p => p.CriadoEm)
            .HasColumnName("criado_em");
    }
}
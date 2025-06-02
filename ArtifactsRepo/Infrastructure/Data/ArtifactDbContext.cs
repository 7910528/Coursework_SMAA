using Microsoft.EntityFrameworkCore;
using ArtifactsRepo.Domain.Entities;

namespace ArtifactsRepo.Infrastructure.Data
{
    public class ArtifactDbContext : DbContext
    {
        public ArtifactDbContext(DbContextOptions<ArtifactDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<SoftwareDevArtifact> Artifacts { get; set; }
        public DbSet<ArtifactVersion> ArtifactVersions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Subcategories)
                .WithOne(c => c.ParentCategory)
                .HasForeignKey(c => c.ParentCategoryId);

            modelBuilder.Entity<Category>()
                .HasMany(c => c.Artifacts)
                .WithOne(a => a.Category)
                .HasForeignKey(a => a.CategoryId);

            modelBuilder.Entity<SoftwareDevArtifact>()
                .HasMany(a => a.Versions)
                .WithOne(v => v.Artifact)
                .HasForeignKey(v => v.SoftwareDevArtifactId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

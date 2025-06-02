using ArtifactsRepo.Application.Interfaces;
using ArtifactsRepo.Domain.Entities;
using ArtifactsRepo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ArtifactsRepo.Infrastructure.Repositories
{
    public class SoftwareDevArtifactRepository : Repository<SoftwareDevArtifact>, ISoftwareDevArtifactRepository
    {
        public SoftwareDevArtifactRepository(ArtifactDbContext context) : base(context) { }

        public void AddVersion(ArtifactVersion version)
        {
            _context.ArtifactVersions.Add(version);
        }

        public void DeleteVersion(ArtifactVersion version)
        {
            _context.ArtifactVersions.Remove(version);
        }

        public IEnumerable<ArtifactVersion> GetVersions(int artifactId)
        {
            return _context.ArtifactVersions
                .Where(v => v.SoftwareDevArtifactId == artifactId)
                .OrderByDescending(v => v.UploadDate)
                .ToList();
        }

        public IEnumerable<SoftwareDevArtifact> GetByCategory(int categoryId)
        {
            return _context.Artifacts
                .Where(a => a.CategoryId == categoryId)
                .ToList();
        }

        public SoftwareDevArtifact GetLatestVersion(int artifactId)
        {
            return _context.Artifacts
                .Include(a => a.Versions)
                .FirstOrDefault(a => a.Id == artifactId);
        }
        public void Save()
        {
            _context.SaveChanges();
        }
    }
}

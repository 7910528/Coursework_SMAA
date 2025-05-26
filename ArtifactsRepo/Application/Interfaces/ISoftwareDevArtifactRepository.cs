using ArtifactsRepo.Domain.Entities;

namespace ArtifactsRepo.Application.Interfaces
{
    public interface ISoftwareDevArtifactRepository : IRepository<SoftwareDevArtifact>
    {
        IEnumerable<SoftwareDevArtifact> GetByCategory(int categoryId);
        void AddVersion(ArtifactVersion version);
        IEnumerable<ArtifactVersion> GetVersions(int artifactId);
        SoftwareDevArtifact GetLatestVersion(int artifactId);
        void Save();
    }
}

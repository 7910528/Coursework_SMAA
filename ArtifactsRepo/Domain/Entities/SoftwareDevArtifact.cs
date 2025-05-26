using System.ComponentModel.DataAnnotations;

namespace ArtifactsRepo.Domain.Entities
{
    public class SoftwareDevArtifact
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }
        public DocumentationType DocumentationType { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public string Author { get; set; } = "Unknown";
        public string Version => Versions.LastOrDefault()?.VersionNumber ?? "1.0.0";
        public string ProgrammingLanguage { get; set; }
        public string Framework { get; set; }
        public string LicenseType { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public ICollection<ArtifactVersion> Versions { get; set; } = new List<ArtifactVersion>
        {
            new ArtifactVersion
            {
                VersionNumber = "1.0.0",
                UploadDate = DateTime.UtcNow,
                Changes = "Initial version",
                DownloadUrl = "https://example.com/download/1/1.0.0"
            }
        };

        public void AddVersion(ArtifactVersion version)
        {
            Versions.Add(version);
        }

        public List<ArtifactVersion> GetVersionHistory()
        {
            return Versions.ToList();
        }
    }
}
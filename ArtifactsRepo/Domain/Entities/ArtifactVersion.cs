﻿namespace ArtifactsRepo.Domain.Entities
{
    public class ArtifactVersion
    {
        public int Id { get; set; }
        public string VersionNumber { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
        public string Changes { get; set; }
        public string DownloadUrl { get; set; }

        public int SoftwareDevArtifactId { get; set; }
        public SoftwareDevArtifact Artifact { get; set; }
    }
}

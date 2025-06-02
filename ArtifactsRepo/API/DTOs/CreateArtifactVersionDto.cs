namespace ArtifactsRepo.API.DTOs
{
    public class CreateArtifactVersionDto
    {
        public string VersionNumber { get; set; }
        public string Changes { get; set; }
        public string DownloadUrl { get; set; }
    }
}

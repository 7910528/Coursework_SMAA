namespace ArtifactsRepo.API.DTOs
{
    public class ArtifactVersionDto
    {
        public int Id { get; set; }
        public string VersionNumber { get; set; }
        public DateTime UploadDate { get; set; }
        public string Changes { get; set; }
        public string DownloadUrl { get; set; }
    }
}

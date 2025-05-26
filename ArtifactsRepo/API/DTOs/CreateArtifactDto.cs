namespace ArtifactsRepo.API.DTOs
{
    public class CreateArtifactDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }
        public string DocumentationType { get; set; }
        public string ProgrammingLanguage { get; set; }
        public string Framework { get; set; }
        public string LicenseType { get; set; }
        public int CategoryId { get; set; }
    }
}

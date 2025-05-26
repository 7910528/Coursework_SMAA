namespace ArtifactsRepo.API.DTOs
{
    public class ArtifactDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }
        public string DocumentationType { get; set; }
        public DateTime Created { get; set; }
        public string Author { get; set; }
        public string Version { get; set; }
        public string ProgrammingLanguage { get; set; }
        public string Framework { get; set; }
        public string LicenseType { get; set; }
        public int CategoryId { get; set; }
    }
}

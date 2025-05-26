namespace ArtifactsRepo.API.DTOs
{
    public class UpdateCategoryDto
    {
        public string Name { get; set; }
        public int? ParentCategoryId { get; set; }
    }
}
using ArtifactsRepo.Domain.Entities;

namespace ArtifactsRepo.API.DTOs
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? ParentCategoryId { get; set; }
        public ICollection<CategoryDto> Subcategories { get; set; }
        public Dictionary<string, List<DocumentationItem>> Documentation { get; set; }
    }
}

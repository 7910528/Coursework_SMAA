using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArtifactsRepo.Domain.Entities
{
    public enum DocumentationType
    {
        API,
        Guide,
        Tutorial
    }

    public class DocumentationItem
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Url { get; set; }
    }

    public class Category
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public int? ParentCategoryId { get; set; }
        public Category ParentCategory { get; set; }
        public ICollection<Category> Subcategories { get; set; } = new List<Category>();

        [NotMapped]
        public Dictionary<DocumentationType, List<DocumentationItem>> Documentation { get; set; } = new();

        public ICollection<SoftwareDevArtifact> Artifacts { get; set; } = new List<SoftwareDevArtifact>();

        public void AddSubcategory(Category subcategory)
        {
            Subcategories.Add(subcategory);
        }

        public void DeleteSubcategory(Category subcategory)
        {
            Subcategories.Remove(subcategory);
        }

        public void ModifyCategory(string name)
        {
            Name = name;
        }

        public bool IsEmpty()
        {
            return !Artifacts.Any() && !Subcategories.Any();
        }
    }
}

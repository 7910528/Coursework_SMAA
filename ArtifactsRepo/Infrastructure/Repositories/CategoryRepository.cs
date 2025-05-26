using ArtifactsRepo.Application.Interfaces;
using ArtifactsRepo.Domain.Entities;
using ArtifactsRepo.Infrastructure.Data;

namespace ArtifactsRepo.Infrastructure.Repositories
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(ArtifactDbContext context) : base(context) { }

        public void AddSubcategory(int parentId, Category subcategory)
        {
            subcategory.ParentCategoryId = parentId;
            _context.Categories.Add(subcategory);
        }

        public IEnumerable<Category> GetSubcategories(int categoryId)
        {
            return _context.Categories
                .Where(c => c.ParentCategoryId == categoryId)
                .ToList();
        }

        public void ModifyCategory(Category category)
        {
            _context.Categories.Update(category);
        }

        public void RearrangeCategory(Category category, int newPosition)
        {
            // Placeholder: adjust logic depending on sorting strategy
        }

        public bool IsEmpty(Category category)
        {
            return !_context.Artifacts.Any(a => a.CategoryId == category.Id);
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}

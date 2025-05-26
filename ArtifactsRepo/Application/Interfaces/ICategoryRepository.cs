using ArtifactsRepo.Domain.Entities;
using System.Collections.Generic;
namespace ArtifactsRepo.Application.Interfaces
{
    public interface ICategoryRepository : IRepository<Category>
    {
        IEnumerable<Category> GetSubcategories(int categoryId);
        void AddSubcategory(int parentId, Category category);
        bool IsEmpty(Category category);
        void ModifyCategory(Category category);
        void RearrangeCategory(Category category, int newPosition);
        void Save();
    }
}

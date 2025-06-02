using ArtifactsRepo.API.DTOs;
using ArtifactsRepo.Application.Interfaces;
using ArtifactsRepo.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ArtifactsRepo.API.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _repository;

        public CategoryController(ICategoryRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<CategoryDto>> GetAll()
        {
            // Only get root categories (where ParentCategoryId is null)
            var rootCategories = _repository.GetAll()
                .Where(c => c.ParentCategoryId == null)
                .Select(c => BuildCategoryDto(c));

            return Ok(rootCategories);
        }

        private CategoryDto BuildCategoryDto(Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                ParentCategoryId = category.ParentCategoryId,
                Subcategories = category.Subcategories
                    .Select(sc => BuildCategoryDto(sc))
                    .ToList(),
                Documentation = category.Documentation.ToDictionary(
                    d => d.Key.ToString(),
                    d => d.Value
                )
            };
        }

        [HttpPost]
        public IActionResult Create(CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                ParentCategoryId = dto.ParentCategoryId
            };

            _repository.Add(category);
            _repository.Save();
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, UpdateCategoryDto dto)
        {
            var category = _repository.GetById(id);
            if (category == null)
                return NotFound();

            category.Name = dto.Name ?? category.Name;
            category.ParentCategoryId = dto.ParentCategoryId ?? category.ParentCategoryId;

            _repository.ModifyCategory(category);
            _repository.Save();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var category = _repository.GetById(id);
            if (category == null)
                return NotFound();

            if (!_repository.IsEmpty(category))
                return BadRequest("Category is not empty. Please remove all subcategories and artifacts before deleting.");

            _repository.Delete(category);
            _repository.Save();
            return Ok();
        }
    }
}
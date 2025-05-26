using ArtifactsRepo.API.DTOs;
using ArtifactsRepo.Application.Interfaces;
using ArtifactsRepo.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ArtifactsRepo.API.Controllers
{
    [ApiController]
    [Route("api/artifacts")]
    public class ArtifactController : ControllerBase
    {
        private readonly ISoftwareDevArtifactRepository _repository;

        public ArtifactController(ISoftwareDevArtifactRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ArtifactDto>> GetAll()
        {
            var artifacts = _repository.GetAll().Select(a => new ArtifactDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                Url = a.Url,
                DocumentationType = a.DocumentationType.ToString(),
                Created = a.Created,
                Author = a.Author,
                Version = a.Version,
                ProgrammingLanguage = a.ProgrammingLanguage,
                Framework = a.Framework,
                LicenseType = a.LicenseType,
                CategoryId = a.CategoryId
            });

            return Ok(artifacts);
        }

        [HttpPost]
        public IActionResult Create(CreateArtifactDto dto)
        {
            var artifact = new SoftwareDevArtifact
            {
                Title = dto.Title,
                Description = dto.Description,
                Url = dto.Url,
                DocumentationType = Enum.Parse<DocumentationType>(dto.DocumentationType),
                ProgrammingLanguage = dto.ProgrammingLanguage,
                Framework = dto.Framework,
                LicenseType = dto.LicenseType,
                Created = DateTime.UtcNow,
                Author = "Unknown",
                CategoryId = dto.CategoryId
            };

            _repository.Add(artifact);
            _repository.Save();
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, UpdateArtifactDto dto)
        {
            var artifact = _repository.GetById(id);
            if (artifact == null)
                return NotFound();

            artifact.Title = dto.Title ?? artifact.Title;
            artifact.Description = dto.Description ?? artifact.Description;
            artifact.Url = dto.Url ?? artifact.Url;
            artifact.DocumentationType = Enum.TryParse(dto.DocumentationType, out DocumentationType docType) ? docType : artifact.DocumentationType;
            artifact.ProgrammingLanguage = dto.ProgrammingLanguage ?? artifact.ProgrammingLanguage;
            artifact.Framework = dto.Framework ?? artifact.Framework;
            artifact.LicenseType = dto.LicenseType ?? artifact.LicenseType;
            artifact.CategoryId = dto.CategoryId != 0 ? dto.CategoryId : artifact.CategoryId;

            _repository.Update(artifact);
            _repository.Save();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var artifact = _repository.GetById(id);
            if (artifact == null)
                return NotFound();

            _repository.Delete(artifact);
            _repository.Save();
            return Ok();
        }
    }
}
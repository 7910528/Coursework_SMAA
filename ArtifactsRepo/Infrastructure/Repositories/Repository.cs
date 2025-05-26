using ArtifactsRepo.Application.Interfaces;
using ArtifactsRepo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ArtifactsRepo.Infrastructure.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ArtifactDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(ArtifactDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public IEnumerable<T> GetAll() => _dbSet.ToList();

        public T GetById(int id) => _dbSet.Find(id);

        public void Add(T entity) => _dbSet.Add(entity);

        public void Update(T entity) => _dbSet.Update(entity);

        public void Delete(T entity) => _dbSet.Remove(entity);

        public IEnumerable<T> Find(Func<T, bool> predicate) => _dbSet.AsEnumerable().Where(predicate);
    }
}

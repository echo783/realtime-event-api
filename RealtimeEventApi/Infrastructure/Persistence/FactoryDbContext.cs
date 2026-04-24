using RealtimeEventApi.Models;
using Microsoft.EntityFrameworkCore;

namespace RealtimeEventApi.Infrastructure.Persistence
{
    public class FactoryDbContext : DbContext
    {
        public FactoryDbContext(DbContextOptions<FactoryDbContext> options)
            : base(options)
        {
        }

        public DbSet<CameraConfig> CameraConfigs => Set<CameraConfig>();
        public DbSet<ProductionEvent> ProductionEvents => Set<ProductionEvent>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<CameraConfig>(entity =>
            {
                entity.ToTable("CameraConfig");
                entity.HasKey(x => x.CameraId);
            });

            modelBuilder.Entity<ProductionEvent>(entity =>
            {
                entity.ToTable("ProductionEvent");
                entity.HasKey(x => x.EventId);
            });
        }
    }
}
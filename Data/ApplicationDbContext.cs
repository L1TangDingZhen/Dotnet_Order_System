using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Order.Models;

namespace Order.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Menu> Menus { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Table> Tables { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.ToTable("Orders");
                entity.HasOne(o => o.Table)
                      .WithMany()
                      .HasForeignKey(o => o.TableId);
            });

            modelBuilder.Entity<Table>(entity =>
            {
                entity.ToTable("Tables");
            });
        }
    }
}

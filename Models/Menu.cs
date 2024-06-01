using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;


namespace Order.Models
{
    public class Menu
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // 添加默认值
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty; // 添加默认值
        public string ImagePath { get; set; } = string.Empty; // 添加默认值
        public bool IsAvailable { get; set; }
        public string Category { get; set; } = string.Empty; // 添加分类字段
        public string Comment { get; set; } = string.Empty; // 添加默认的评论属性


        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}


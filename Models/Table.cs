using System.ComponentModel.DataAnnotations;

namespace Order.Models
{
    public class Table
    {
        [Key]
        public int Id { get; set; }
        public string TableName { get; set; } = string.Empty; // 这里确保 TableName 有一个默认值，避免非空警告
        public bool IsAvailable { get; set; }
    }

}

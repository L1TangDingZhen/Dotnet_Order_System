using System;

namespace Order.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int MenuId { get; set; }
        public Menu Menu { get; set; } = new Menu(); // 添加默认值
        public int Quantity { get; set; }
        public DateTime OrderTime { get; set; }
        public int TableId { get; set; } // 关联到桌子编号
        public Table Table { get; set; } = new Table(); // 添加默认值
        public bool IsPaid { get; set; }
        public string Comment { get; set; } = string.Empty;
    }


}

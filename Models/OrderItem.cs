using System;

namespace Order.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int MenuId { get; set; }
        public Menu Menu { get; set; }
        public int Quantity { get; set; }
        public DateTime OrderTime { get; set; }
        public int TableNumber { get; set; }
        public bool IsPaid { get; set; }
    }
}

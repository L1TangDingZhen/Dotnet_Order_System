namespace Order.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int TableId { get; set; }
        public DateTime OrderTime { get; set; }
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}

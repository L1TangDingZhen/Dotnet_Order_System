﻿namespace Order.Models
{
    public class Menu
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }

        public bool IsAvailable { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace Order.Models
{
    public class Table
    {
        [Key]
        public int Id { get; set; }
        public string TableName { get; set; } = string.Empty; // ����ȷ�� TableName ��һ��Ĭ��ֵ������ǿվ���
        public bool IsAvailable { get; set; }
    }

}

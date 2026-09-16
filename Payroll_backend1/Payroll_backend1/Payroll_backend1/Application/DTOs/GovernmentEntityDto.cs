namespace SB.PayrollManagement.Application.DTOs
{
    public class GovernmentEntityDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string RNC { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal DiscountPercentage { get; set; }
    }
}

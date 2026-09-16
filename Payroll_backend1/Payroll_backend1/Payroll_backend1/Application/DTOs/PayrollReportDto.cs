namespace SB.PayrollManagement.Application.DTOs
{
    public class PayrollReportDto
    {
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public int TotalEmployees { get; set; }
        public decimal TotalPayrollAmount { get; set; }
        public List<EmployeeDto> Employees { get; set; } = new();
    }
}

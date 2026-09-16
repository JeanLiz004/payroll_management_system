using SB.PayrollManagement.Domain.Enums;

namespace SB.PayrollManagement.Application.DTOs
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string SocialSecurityNumber { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int EmployeeType { get; set; }
        public decimal? WeeklySalary { get; set; }
        public decimal? HourlyRate { get; set; }
        public decimal? HoursWorked { get; set; }
        public decimal? GrossSales { get; set; }
        public decimal? CommissionRate { get; set; }
        public decimal? BaseSalary { get; set; }
        public decimal CalculatedEarnings { get; set; }
    }

}

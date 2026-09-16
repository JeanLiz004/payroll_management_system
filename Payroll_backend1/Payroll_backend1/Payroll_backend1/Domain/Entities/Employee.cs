using SB.PayrollManagement.Domain.Enums;

namespace SB.PayrollManagement.Domain.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string SocialSecurityNumber { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public EmployeeType EmployeeType { get; set; }

        public decimal? WeeklySalary { get; set; }
        public decimal? HourlyRate { get; set; }
        public decimal? HoursWorked { get; set; }
        public decimal? GrossSales { get; set; }
        public decimal? CommissionRate { get; set; }
        public decimal? BaseSalary { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public decimal CalculateWeeklyPay()
        {
            return EmployeeType switch
            {
                EmployeeType.Salaried => WeeklySalary ?? 0,
                EmployeeType.Hourly => (HoursWorked <= 40
                    ? (HoursWorked ?? 0) * (HourlyRate ?? 0)
                    : (40 * (HourlyRate ?? 0)) + (((HoursWorked ?? 0) - 40) * (HourlyRate ?? 0) * 1.5m)),
                EmployeeType.Commission => (GrossSales ?? 0) * (CommissionRate ?? 0),
                EmployeeType.BasePlusCommission => (BaseSalary ?? 0) + ((GrossSales ?? 0) * (CommissionRate ?? 0)),
                _ => 0
            };
        }
    }


}

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

        // Specific Payroll Calculation Fields
        public decimal? WeeklySalary { get; set; }
        public decimal? HourlyRate { get; set; }
        public decimal? HoursWorked { get; set; }
        public decimal? GrossSales { get; set; }
        public decimal? CommissionRate { get; set; }
        public decimal? BaseSalary { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Calculates weekly payment according to payroll specification business rules.
        /// </summary>
        public decimal CalculateWeeklyPay()
        {
            return EmployeeType switch
            {
                EmployeeType.Salaried => WeeklySalary ?? 0m,
                EmployeeType.Hourly => CalculateHourlyPay(HourlyRate ?? 0m, HoursWorked ?? 0m),
                EmployeeType.Commission => (GrossSales ?? 0m) * (CommissionRate ?? 0m),
                EmployeeType.SalariedCommission => ((GrossSales ?? 0m) * (CommissionRate ?? 0m)) + (BaseSalary ?? 0m) + ((BaseSalary ?? 0m) * 0.10m),
                _ => throw new InvalidOperationException("Invalid employee type.")
            };
        }

        private static decimal CalculateHourlyPay(decimal rate, decimal hours)
        {
            if (hours <= 40m)
            {
                return rate * hours;
            }
            return (rate * 40m) + (rate * 1.5m * (hours - 40m));
        }
    }
}

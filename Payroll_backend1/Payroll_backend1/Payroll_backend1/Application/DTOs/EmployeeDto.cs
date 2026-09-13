using SB.PayrollManagement.Domain.Enums;

namespace SB.PayrollManagement.Application.DTOs
{
    public record EmployeeDto(
         int Id,
         string FirstName,
         string LastName,
         string SocialSecurityNumber,
         string Department,
         bool IsActive,
         EmployeeType EmployeeType,
         decimal? WeeklySalary,
         decimal? HourlyRate,
         decimal? HoursWorked,
         decimal? GrossSales,
         decimal? CommissionRate,
         decimal? BaseSalary,
         decimal CalculatedWeeklyPay
     );

    public record CreateEmployeeDto(
        string FirstName,
        string LastName,
        string SocialSecurityNumber,
        string Department,
        EmployeeType EmployeeType,
        decimal? WeeklySalary,
        decimal? HourlyRate,
        decimal? HoursWorked,
        decimal? GrossSales,
        decimal? CommissionRate,
        decimal? BaseSalary
    );
}

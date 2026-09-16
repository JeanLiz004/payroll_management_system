using SB.PayrollManagement.Application.DTOs;

namespace SB.PayrollManagement.Application.Interfaces
{
    public interface IPayrollReportService
    {
        Task<PayrollReportDto> GenerateWeeklyReportAsync();
    }
}

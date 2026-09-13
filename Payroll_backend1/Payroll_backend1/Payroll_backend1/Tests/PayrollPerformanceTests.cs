using SB.PayrollManagement.Domain.Entities;
using SB.PayrollManagement.Domain.Enums;
using System.Diagnostics;
using Xunit;

namespace SB.PayrollManagement.Tests
{
    public class PayrollPerformanceTests
    {
        [Fact]
        public void CalculatePayroll_1000Employees_ExecutesUnder2Seconds()
        {
            // Arrange: Generate 1,000 synthetic employee records across contract types
            var employees = new List<Employee>();
            var random = new Random();

            for (int i = 1; i <= 1000; i++)
            {
                var type = (EmployeeType)(random.Next(1, 5));
                employees.Add(new Employee
                {
                    Id = i,
                    FirstName = $"Employee{i}",
                    LastName = "Test",
                    SocialSecurityNumber = $"001-{i:D7}-1",
                    Department = "General",
                    IsActive = true,
                    EmployeeType = type,
                    WeeklySalary = 12000m,
                    HourlyRate = 250m,
                    HoursWorked = 48m,
                    GrossSales = 150000m,
                    CommissionRate = 0.06m,
                    BaseSalary = 8000m
                });
            }

            // Act & Benchmark
            var stopwatch = Stopwatch.StartNew();
            var payrollResults = employees.Select(e => new
            {
                e.Id,
                e.FirstName,
                Pay = e.CalculateWeeklyPay()
            }).ToList();
            stopwatch.Stop();

            // Assert
            Assert.Equal(1000, payrollResults.Count);
            Assert.True(stopwatch.ElapsedMilliseconds < 2000, $"Payroll calculation took {stopwatch.ElapsedMilliseconds} ms, exceeding 2000 ms limit.");
        }

        [Theory]
        [InlineData(40, 200, 8000)]        // 40 hours standard pay
        [InlineData(50, 200, 11000)]       // 40h standard + 10h overtime (1.5x)
        public void CalculateHourlyPay_CorrectlyCalculatesOvertime(decimal hours, decimal rate, decimal expectedPay)
        {
            // Arrange
            var employee = new Employee
            {
                EmployeeType = EmployeeType.Hourly,
                HoursWorked = hours,
                HourlyRate = rate
            };

            // Act
            var calculatedPay = employee.CalculateWeeklyPay();

            // Assert
            Assert.Equal(expectedPay, calculatedPay);
        }

        [Fact]
        public void CalculateSalariedCommissionPay_AppliesTenPercentBaseBonus()
        {
            // Arrange: (100,000 * 0.05) + 10,000 + (10,000 * 0.10) = 5,000 + 10,000 + 1,000 = 16,000
            var employee = new Employee
            {
                EmployeeType = EmployeeType.SalariedCommission,
                GrossSales = 100000m,
                CommissionRate = 0.05m,
                BaseSalary = 10000m
            };

            // Act
            var pay = employee.CalculateWeeklyPay();

            // Assert
            Assert.Equal(16000m, pay);
        }
    }
}

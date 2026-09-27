export interface PayrollEmployee {
  id: number;
  firstName: string;
  lastName: string;
  socialSecurityNumber: string;
  department: string;
  isActive: boolean;
  employeeType: number;
  weeklySalary: number;
  hourlyRate: number;
  hoursWorked: number;
  grossSales: number;
  commissionRate: number;
  baseSalary: number;
  calculatedEarnings: number;
}

export interface PayrollReportResponse {
  generatedAt: string;
  totalEmployees: number;
  totalPayrollAmount: number;
  employees: PayrollEmployee[];
}

export interface ProcessPayrollDto {
  periodStart?: string;
  periodEnd?: string;
  notes?: string;
}
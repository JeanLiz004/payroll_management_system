// Existing Government Entity types...
export interface GovernmentEntity {
  id: number;
  name: string;
  rnc: string;
  description?: string;
  discountPercentage: number;
}

export interface CreateGovernmentEntityDto {
  name: string;
  rnc: string;
  description?: string;
  discountPercentage: number;
}

// Add these missing User and Report types:
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface CreateUserDto {
  username: string;
  password?: string;
  role: string;
}

export interface UpdateUserDto {
  username: string;
  password?: string; // Optional during updates so password isn't overwritten if left blank
  role: string;
}

export interface PayrollReportFilter {
  startDate?: string;
  endDate?: string;
  departmentId?: number;
  employeeId?: number;
}

export interface PayrollReportEmployee {
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
  employees: PayrollReportEmployee[];
}
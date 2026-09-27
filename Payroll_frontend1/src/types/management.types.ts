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
  email: string;
  password?: string;
  role: string;
}

export interface PayrollReportFilter {
  startDate?: string;
  endDate?: string;
  departmentId?: number;
  employeeId?: number;
}

export interface PayrollReportItem {
  id: number;
  employeeName: string;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  payDate: string;
}
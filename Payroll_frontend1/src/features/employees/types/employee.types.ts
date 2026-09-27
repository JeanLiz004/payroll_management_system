export const EmployeeType = {
  Salaried: 0,
  Hourly: 1,
  Commission: 2,
  BasePlusCommission: 3,
} as const;

export type EmployeeType = (typeof EmployeeType)[keyof typeof EmployeeType];

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  socialSecurityNumber: string;
  department: string;
  isActive: boolean;
  employeeType: EmployeeType;
  weeklySalary?: number;
  hourlyRate?: number;
  hoursWorked?: number;
  grossSales?: number;
  commissionRate?: number;
  baseSalary?: number;
  calculatedEarnings: number;
}

export type CreateEmployeeDto = Omit<Employee, 'id' | 'calculatedEarnings'>;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeForm } from '../components/EmployeeForm';
import { useEmployees } from '../hooks/useEmployees';

export const CreateEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { createEmployee, isCreating } = useEmployees();

  return (
    <div className="py-6">
      <EmployeeForm
        isLoading={isCreating}
        onSubmit={async (dto) => {
          await createEmployee(dto);
          navigate('/employees');
        }}
      />
    </div>
  );
};
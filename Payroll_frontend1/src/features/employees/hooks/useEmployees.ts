import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../services/employeeApi';
import type { CreateEmployeeDto } from '../types/employee.types';

// Clave única para la caché de React Query
export const EMPLOYEE_KEYS = {
  all: ['employees'] as const,
  detail: (id: number) => ['employees', id] as const,
};

export const useEmployees = (params?: { name?: string; department?: string; active?: boolean }) => {
  const queryClient = useQueryClient();

  // GET: Obtener todos los empleados
  const employeesQuery = useQuery({
    queryKey: [...EMPLOYEE_KEYS.all, params],
    queryFn: () => employeeApi.getAll(params),
  });

  // POST: Crear empleado
  const createMutation = useMutation({
    mutationFn: (dto: CreateEmployeeDto) => employeeApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all });
    },
  });

  // PUT: Actualizar empleado
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CreateEmployeeDto> }) =>
      employeeApi.update(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.detail(id) });
    },
  });

  // DELETE: Eliminar empleado
  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all });
    },
  });

  return {
    employees: employeesQuery.data ?? [],
    isLoading: employeesQuery.isLoading,
    isError: employeesQuery.isError,
    error: employeesQuery.error,
    refetch: employeesQuery.refetch,
    createEmployee: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateEmployee: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteEmployee: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

// Hook independiente para obtener un solo empleado por ID (para edición)
export const useEmployee = (id: number) => {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.detail(id),
    queryFn: () => employeeApi.getById(id),
    enabled: !!id && !isNaN(id),
  });
};
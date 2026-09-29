import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { managementService } from '../services/managementService';
import type {
  CreateGovernmentEntityDto,
  CreateUserDto,
  UpdateUserDto,
  PayrollReportFilter,
} from '../types/management.types';

export const MANAGEMENT_KEYS = {
  entities: ['government-entities'] as const,
  users: ['users'] as const,
  reports: (filter?: PayrollReportFilter) => ['payroll-report', filter] as const,
};

export const useGovernmentEntities = () => {
  const queryClient = useQueryClient();

  const entitiesQuery = useQuery({
    queryKey: MANAGEMENT_KEYS.entities,
    queryFn: managementService.getGovernmentEntities,
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateGovernmentEntityDto) => managementService.createGovernmentEntity(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MANAGEMENT_KEYS.entities }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CreateGovernmentEntityDto }) =>
      managementService.updateGovernmentEntity(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MANAGEMENT_KEYS.entities }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => managementService.deleteGovernmentEntity(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MANAGEMENT_KEYS.entities }),
  });

  return {
    entities: entitiesQuery.data ?? [],
    isLoading: entitiesQuery.isLoading,
    isError: entitiesQuery.isError,
    createEntity: createMutation.mutateAsync,
    updateEntity: updateMutation.mutateAsync,
    deleteEntity: deleteMutation.mutateAsync,
  };
};

export const useUsers = () => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: MANAGEMENT_KEYS.users,
    queryFn: managementService.getUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: (dto: CreateUserDto) => managementService.createUser(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MANAGEMENT_KEYS.users }),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateUserDto }) =>
      managementService.updateUser(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MANAGEMENT_KEYS.users }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => managementService.deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MANAGEMENT_KEYS.users }),
  });

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
  };
};

export const usePayrollReport = (filter?: PayrollReportFilter) => {
  return useQuery({
    queryKey: MANAGEMENT_KEYS.reports(filter),
    queryFn: () => managementService.getPayrollReport(filter),
  });
};
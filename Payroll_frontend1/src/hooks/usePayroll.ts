import { useQuery, useMutation } from '@tanstack/react-query';
import { payrollService } from '../services/payrollService';

export const usePayroll = () => {
  const {
    data,
    isLoading: isLoadingReceipts,
    isError: isErrorReceipts,
    refetch,
  } = useQuery({
    queryKey: ['payrollReport'],
    queryFn: payrollService.getPayrollReport,
  });

  const downloadPdfMutation = useMutation({
    mutationFn: (employeeId: number) => payrollService.downloadPayrollPdf(employeeId),
  });

  return {
    receipts: data?.employees ?? [],
    payrollSummary: {
      totalEmployees: data?.totalEmployees ?? 0,
      totalPayrollAmount: data?.totalPayrollAmount ?? 0,
    },
    isLoadingReceipts,
    isErrorReceipts,
    refetchReceipts: () => refetch(),
    downloadPdf: downloadPdfMutation.mutateAsync,
    isDownloadingPdf: downloadPdfMutation.isPending,
  };
};
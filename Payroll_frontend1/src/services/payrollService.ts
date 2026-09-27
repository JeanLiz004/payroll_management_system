import {apiClient} from './apiClient'; // or your axios instance

export const payrollService = {
  getPayrollReport: async () => {
    const response = await apiClient.get('/Reports/payroll');
    return response.data;
  },

  downloadPayrollPdf: async (employeeId: number) => {
    const response = await apiClient.get(`/Reports/payroll/${employeeId}/pdf`, {
      responseType: 'blob',
    });

    // Extract filename or fallback
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Recibo_Nomina_${employeeId}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Cleanup memory
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
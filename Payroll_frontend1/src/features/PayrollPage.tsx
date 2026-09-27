import { useState } from 'react';
import { usePayroll } from '../hooks/usePayroll';
import type { PayrollEmployee } from '../types/payroll.types';

export const PayrollPage = () => {
  const {
    receipts,
    payrollSummary,
    isLoadingReceipts,
    isErrorReceipts,
    refetchReceipts,
    downloadPdf,
  } = usePayroll();

  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
    }).format(amount || 0);
  };

  const getEmployeeTypeName = (type: number) => {
    switch (type) {
      case 0: return 'Asalariado (Fijo)';
      case 1: return 'Por Horas';
      case 2: return 'Comisionista';
      case 3: return 'Base + Comisión';
      default: return 'Desconocido';
    }
  };

  const handleDownloadPdf = async (employeeId: number) => {
    try {
      setDownloadingId(employeeId);
      await downloadPdf(employeeId);
    } catch (error) {
      console.error('Error descargando el PDF:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>
            Nómina y Recibos de Pago
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b' }}>
            Reporte consolidado de salarios y ganancias devengadas.
          </p>
        </div>

        <button
          onClick={() => refetchReceipts()}
          disabled={isLoadingReceipts}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: isLoadingReceipts ? 'not-allowed' : 'pointer',
            opacity: isLoadingReceipts ? 0.7 : 1,
          }}
        >
          {isLoadingReceipts ? 'Actualizando...' : 'Actualizar Reporte'}
        </button>
      </header>

      {/* Summary Cards */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
            Total Empleados
          </span>
          <h2 style={{ margin: '8px 0 0', fontSize: '22px', color: '#0f172a' }}>
            {payrollSummary.totalEmployees}
          </h2>
        </div>

        <div
          style={{
            backgroundColor: '#f0fdf4',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #bbf7d0',
          }}
        >
          <span style={{ fontSize: '13px', color: '#166534', fontWeight: 600 }}>
            Monto Total de Nómina
          </span>
          <h2 style={{ margin: '8px 0 0', fontSize: '22px', color: '#15803d' }}>
            {formatCurrency(payrollSummary.totalPayrollAmount)}
          </h2>
        </div>
      </section>

      {/* Table */}
      {!isLoadingReceipts && !isErrorReceipts && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '14px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', color: '#475569' }}>Empleado</th>
                <th style={{ padding: '12px 16px', color: '#475569' }}>Departamento</th>
                <th style={{ padding: '12px 16px', color: '#475569' }}>Tipo</th>
                <th style={{ padding: '12px 16px', color: '#475569' }}>Salario Base</th>
                <th style={{ padding: '12px 16px', color: '#475569' }}>Ganancias Calculadas</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', color: '#475569' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((employee: PayrollEmployee) => (
                <tr key={employee.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>
                    {employee.firstName} {employee.lastName}
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      NSS: {employee.socialSecurityNumber}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>
                    {employee.department}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {getEmployeeTypeName(employee.employeeType)}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>
                    {formatCurrency(employee.baseSalary)}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#16a34a' }}>
                    {formatCurrency(employee.calculatedEarnings)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDownloadPdf(employee.id)}
                      disabled={downloadingId === employee.id}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#2563eb',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        cursor: downloadingId === employee.id ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {downloadingId === employee.id ? 'Guardando...' : 'Descargar PDF'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
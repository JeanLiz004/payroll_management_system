export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
  }).format(amount || 0);
};

export const getEmployeeTypeName = (type: number): string => {
  const types: Record<number, string> = {
    0: 'Asalariado (Fijo)',
    1: 'Por Horas',
    2: 'Comisionista',
    3: 'Base + Comisión',
  };
  return types[type] ?? 'Desconocido';
};
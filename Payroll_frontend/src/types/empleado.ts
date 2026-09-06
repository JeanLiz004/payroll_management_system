// 1. Objeto constante para los valores de tiempo de ejecución
export const TipoEmpleado = {
  Asalariado: 0,
  PorHora: 1,
  PorComision: 2,
  AsalariadoConComision: 3,
} as const;

// 2. Tipo derivado para la verificación estática de TypeScript
export type TipoEmpleado = (typeof TipoEmpleado)[keyof typeof TipoEmpleado];

export interface ItemReporteNominaDto {
  empleadoId: number;
  nombreCompleto: string;
  tipoEmpleado: string;
  pagoSemanal: number;
  detalleCalculo: string;
}

export interface CrearEmpleadoDto {
  nombre: string;
  apellidoPaterno: string;
  numeroSeguroSocial: string;
  departamento: string;
  tipo: TipoEmpleado;
  salarioSemanal?: number;
  tarifaPorHora?: number;
  horasTrabajadas?: number;
  ventasBrutas?: number;
  tarifadeComision?: number;
  salarioBase?: number;
}
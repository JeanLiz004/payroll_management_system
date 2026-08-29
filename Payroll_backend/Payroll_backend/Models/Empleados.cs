namespace Payroll_backend.Models
{

    public enum TipoEmpleado
    {
        Asalariado,
        PorHora,
        PorComision,
        AsalariadoConComision
    }

    public abstract class Empleado
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string ApellidoPaterno { get; set; } = string.Empty;
        public string NumeroSeguroSocial { get; set; } = string.Empty;
        public string Departamento { get; set; } = string.Empty;
        public bool Activo { get; set; } = true;
        public TipoEmpleado Tipo { get; protected set; }

        public abstract decimal CalcularPagoSemanal();
    }

    public class EmpleadoAsalariado : Empleado
    {
        public decimal SalarioSemanal { get; set; }

        public EmpleadoAsalariado() => Tipo = TipoEmpleado.Asalariado;

        public override decimal CalcularPagoSemanal() => SalarioSemanal;
    }

    public class EmpleadoPorHora : Empleado
    {
        public decimal TarifaPorHora { get; set; }
        public double HorasTrabajadas { get; set; }

        public EmpleadoPorHora() => Tipo = TipoEmpleado.PorHora;

        public override decimal CalcularPagoSemanal()
        {
            if (HorasTrabajadas <= 40)
                return TarifaPorHora * (decimal)HorasTrabajadas;

            decimal pagoRegular = TarifaPorHora * 40;
            decimal pagoHorasExtras = TarifaPorHora * 1.5m * (decimal)(HorasTrabajadas - 40);
            return pagoRegular + pagoHorasExtras;
        }
    }

    public class EmpleadoPorComision : Empleado
    {
        public decimal VentasBrutas { get; set; }
        public decimal TarifadeComision { get; set; }

        public EmpleadoPorComision() => Tipo = TipoEmpleado.PorComision;

        public override decimal CalcularPagoSemanal() => VentasBrutas * TarifadeComision;
    }

    public class EmpleadoAsalariadoConComision : Empleado
    {
        public decimal VentasBrutas { get; set; }
        public decimal TarifadeComision { get; set; }
        public decimal SalarioBase { get; set; }

        public EmpleadoAsalariadoConComision() => Tipo = TipoEmpleado.AsalariadoConComision;

        public override decimal CalcularPagoSemanal()
        {
            decimal pagoComision = VentasBrutas * TarifadeComision;
            decimal pagoBaseConBono = SalarioBase + (SalarioBase * 0.10m);
            return pagoComision + pagoBaseConBono;
        }
    }
}

using Payroll_backend.Models;
using FluentValidation;

namespace Payroll_backend.DTO
{
  

    public class CrearEmpleadoDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string ApellidoPaterno { get; set; } = string.Empty;
        public string NumeroSeguroSocial { get; set; } = string.Empty;
        public string Departamento { get; set; } = string.Empty;
        public TipoEmpleado Tipo { get; set; }

        // Parámetros condicionales
        public decimal? SalarioSemanal { get; set; }
        public decimal? TarifaPorHora { get; set; }
        public double? HorasTrabajadas { get; set; }
        public decimal? VentasBrutas { get; set; }
        public decimal? TarifadeComision { get; set; }
        public decimal? SalarioBase { get; set; }
    }

    public class CrearEmpleadoDtoValidador : AbstractValidator<CrearEmpleadoDto>
    {
        public CrearEmpleadoDtoValidador()
        {
            RuleFor(x => x.ApellidoPaterno).NotEmpty().WithMessage("El apellido paterno es obligatorio.");
            RuleFor(x => x.NumeroSeguroSocial).NotEmpty().WithMessage("El número de seguro social es obligatorio.");

            When(x => x.Tipo == TipoEmpleado.Asalariado, () => {
                RuleFor(x => x.Nombre).NotEmpty();
                RuleFor(x => x.SalarioSemanal).GreaterThan(0);
            });

            When(x => x.Tipo == TipoEmpleado.PorHora, () => {
                RuleFor(x => x.TarifaPorHora).GreaterThan(0);
                RuleFor(x => x.HorasTrabajadas).GreaterThanOrEqualTo(0);
            });

            When(x => x.Tipo == TipoEmpleado.PorComision, () => {
                RuleFor(x => x.Nombre).NotEmpty();
                RuleFor(x => x.VentasBrutas).GreaterThanOrEqualTo(0);
                RuleFor(x => x.TarifadeComision).InclusiveBetween(0, 1);
            });

            When(x => x.Tipo == TipoEmpleado.AsalariadoConComision, () => {
                RuleFor(x => x.Nombre).NotEmpty();
                RuleFor(x => x.VentasBrutas).GreaterThanOrEqualTo(0);
                RuleFor(x => x.TarifadeComision).InclusiveBetween(0, 1);
                RuleFor(x => x.SalarioBase).GreaterThan(0);
            });
        }
    }
}

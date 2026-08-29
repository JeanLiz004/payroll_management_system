using Payroll_backend.Models;
using NUnit.Framework;
using Microsoft.AspNetCore.Mvc.RazorPages;


namespace Payroll_backend.Pruebas
{


    public class PruebasCalculoNomina
    {
        [Test]
        public void CalcularPagoSemanal_EmpleadoPorHora_ConHorasExtras_CalculaCorrectamente()
        {
            var emp = new EmpleadoPorHora { TarifaPorHora = 10m, HorasTrabajadas = 50 };
            decimal pago = emp.CalcularPagoSemanal();
            Assert.That(pago, Is.EqualTo(550m)); // (40 * 10) + (10 * 15) = 400 + 150 = 550
        }

        [Test]
        public void CalcularPagoSemanal_EmpleadoAsalariadoConComision_CalculaCorrectamente()
        {
            var emp = new EmpleadoAsalariadoConComision { VentasBrutas = 1000m, TarifadeComision = 0.10m, SalarioBase = 500m };
            decimal pago = emp.CalcularPagoSemanal();
            Assert.That(pago, Is.EqualTo(550m)); // (1000 * 0.10) + 500 + (500 * 0.10) = 100 + 500 + 50 = 650
        }

        [Test]
        public void CalcularPagoSemanal_EmpleadoAsalariado_RetornaSalarioFijo()
        {
            var emp = new EmpleadoAsalariado { SalarioSemanal = 1200m };
            Assert.That(emp.CalcularPagoSemanal(), Is.EqualTo(1200m));
        }
    }
}

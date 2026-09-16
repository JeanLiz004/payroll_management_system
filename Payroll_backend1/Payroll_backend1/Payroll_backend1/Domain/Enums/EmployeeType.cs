namespace SB.PayrollManagement.Domain.Enums
{
    public enum EmployeeType
    {
        Salaried,
        Hourly,
        Commission,
        BasePlusCommission,   // O SalariedCommission si prefieres usar ese nombre
        SalariedCommission = BasePlusCommission // Alias para retrocompatibilidad con las pruebas
    }
}

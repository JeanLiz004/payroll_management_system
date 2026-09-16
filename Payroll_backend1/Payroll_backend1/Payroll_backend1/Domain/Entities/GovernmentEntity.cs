namespace SB.PayrollManagement.Domain.Entities
{
    public class GovernmentEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string RNC { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal DiscountPercentage { get; set; }

        // Propiedades faltantes agregadas:
        public string? Category { get; set; }
        public string? StatePower { get; set; }
        public string? Sector { get; set; }
    }
}

namespace SB.PayrollManagement.Domain.Entities
{
    public class GovernmentEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string StatePower { get; set; } = string.Empty;
        public string Sector { get; set; } = string.Empty;
    }
}

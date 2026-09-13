namespace SB.PayrollManagement.Application.DTOs
{
    public class GovernmentEntityDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string StatePower { get; set; } = string.Empty;
        public string Sector { get; set; } = string.Empty;
    }
}

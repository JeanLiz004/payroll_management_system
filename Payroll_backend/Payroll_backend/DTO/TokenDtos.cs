namespace Payroll_backend.DTO
{
    public class TokenDtos
    {

    }

    public class SolicitudRefreshDto
    {
        public string TokenExpirado { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
    }
}

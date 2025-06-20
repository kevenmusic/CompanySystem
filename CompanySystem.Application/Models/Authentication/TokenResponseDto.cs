namespace CompanySystem.Application.Models.Authentication
{
    public class TokenResponseDto
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
        public UserInfoDto User { get; set; }
    }
}

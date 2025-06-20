namespace CompanySystem.Domain.Entities
{
    public class UserEntity : BaseEntity
    {
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public virtual ICollection<BreakdownEntity> Breakdowns { get; set; } = new List<BreakdownEntity>();
    }
}

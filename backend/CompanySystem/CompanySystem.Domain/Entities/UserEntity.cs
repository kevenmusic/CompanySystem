using System.Text.Json.Serialization;

namespace CompanySystem.Domain.Entities
{
    public class UserEntity : BaseEntity
    {
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public long RoleId { get; set; } 
        public string? RefreshToken { get; set; }
        public DateTimeOffset? RefreshTokenExpiryTime { get; set; }
        [JsonIgnore]
        public virtual RoleEntity Role { get; set; } = null!;
        public virtual EmployeeEntity? Employee { get; set; }
        public virtual ICollection<BreakdownEntity> Breakdowns { get; set; } = new List<BreakdownEntity>();
    }
}
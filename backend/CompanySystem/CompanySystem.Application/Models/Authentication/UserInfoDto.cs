namespace CompanySystem.Application.Models.Authentication
{
    public class UserInfoDto
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public List<string> Roles { get; set; }
        public string? EmployeeName { get; set; }
    }
}
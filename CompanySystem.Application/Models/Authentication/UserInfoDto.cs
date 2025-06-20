namespace CompanySystem.Application.Models.Authentication
{
    public class UserInfoDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public List<string> Roles { get; set; }
    }
}

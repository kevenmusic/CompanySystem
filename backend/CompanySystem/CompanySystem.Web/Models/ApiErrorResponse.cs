namespace CompanySystem.Web.Models
{
    public class ApiErrorResponse
    {
        public required int Code { get; set; } 
        public required string Message { get; set; }
        public string? Description { get; set; }
    }
}

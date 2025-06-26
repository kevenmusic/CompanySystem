using CompanySystem.Application.Models.Breakdowns;
using CompanySystem.Domain.Entities;

namespace CompanySystem.Application.Mappers
{
    public static class BreakdownsMapper
    {
        public static BreakdownDto toDto(this BreakdownEntity entity)
        {
            return new BreakdownDto
            {
                Id = entity.Id,
                Description = entity.Description,
                DateReported = entity.DateReported,
                Status = entity.Status,
                EmployeeId = entity.EmployeeId,    
                UserId = entity.UserId
            };
        }

        public static BreakdownEntity toEntity(this BreakdownDto dto, long employeeId, long userId)
        {
            return new BreakdownEntity
            {
                Id = dto.Id,
                Description = dto.Description,
                DateReported = dto.DateReported,
                Status = dto.Status,
                EmployeeId = employeeId,
                UserId = userId
            };
        }
    }
}

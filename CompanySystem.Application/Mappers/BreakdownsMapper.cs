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
                DepartmentId = entity.DepartmentId,
                UserId = entity.UserId
            };
        }

        public static List<BreakdownDto> toDto(this IEnumerable<BreakdownEntity> entities)
        {
            return entities.Select(e => e.toDto()).ToList();
        }

        public static BreakdownEntity toEntity(this BreakdownDto dto, long employeeId, long departmentId, long userId)
        {
            return new BreakdownEntity
            {
                Id = dto.Id,
                Description = dto.Description,
                DateReported = dto.DateReported,
                Status = dto.Status,
                EmployeeId = employeeId,
                DepartmentId = departmentId,
                UserId = userId
            };
        }
    }
}

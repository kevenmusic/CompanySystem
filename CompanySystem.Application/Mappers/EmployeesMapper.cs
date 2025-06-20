using CompanySystem.Application.Models.Employees;
using CompanySystem.Domain.Entities;

namespace CompanySystem.Application.Mappers
{
    public static class EmployeesMapper
    {
        public static EmployeeDto ToDto(this EmployeeEntity entity)
        {
            return new EmployeeDto
            {
                Id = entity.Id,
                Name = entity.Name
            };
        }

        public static EmployeeEntity ToEntity(this EmployeeDto dto)
        {
            return new EmployeeEntity
            {
                Id = dto.Id,
                Name = dto.Name
            };
        }
        public static EmployeeEntity ToEntity(this CreateEmployeeDto dto)
        {
            return new EmployeeEntity
            {
                Name = dto.Name
            };
        }
    }
}

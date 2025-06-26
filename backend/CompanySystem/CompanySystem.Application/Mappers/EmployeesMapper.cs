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
                DepartmentId = entity.DepartmentId,
                UserId = entity.UserId,
                FullName = entity.FullName
            };
        }

        public static EmployeeEntity ToEntity(this EmployeeDto dto)
        {
            return new EmployeeEntity
            {
                Id = dto.Id,
                DepartmentId = dto.DepartmentId,
                FullName = dto.FullName
            };
        }
        public static EmployeeEntity ToEntity(this CreateEmployeeDto dto)
        {
            return new EmployeeEntity
            {
                DepartmentId = dto.DepartmentId,
                FullName = dto.FullName
            };
        }
    }
}

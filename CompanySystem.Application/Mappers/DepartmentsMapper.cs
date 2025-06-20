using CompanySystem.Application.Models.Departments;
using CompanySystem.Domain.Entities;

namespace CompanySystem.Application.Mappers
{
    public static class DepartmentsMapper
    {
        public static DepartmentDto ToDto(this DepartmentEntity entity)
        {
            return new DepartmentDto
            {
                Id = entity.Id,
                Name = entity.Name,
                ManagerFullName = entity.ManagerFullName
            };
        }

        public static DepartmentEntity ToEntity(this CreateDepartmentDto dto)
        {
            return new DepartmentEntity
            {
                Name = dto.Name,
                ManagerFullName = dto.ManagerFullName
            };
        }

        public static void UpdateEntity(this DepartmentEntity entity, UpdateDepartmentDto dto)
        {
            entity.Name = dto.Name;
            entity.ManagerFullName = dto.ManagerFullName;
        }
    }
}

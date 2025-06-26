using CompanySystem.Application.Models.Authentication;
using CompanySystem.Domain.Entities;

namespace CompanySystem.Application.Mappers
{
    public static class UserMapper
    {

        public static UserDto ToDto(this UserEntity entity)
        {
            return new UserDto
            {
                Username = entity.Username
            };
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CompanySystem.Application.Models.Authentication;
using CompanySystem.Application.Models.Employees;
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

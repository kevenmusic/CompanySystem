using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CompanySystem.Application.Models.Employees
{
    public class EmployeeDto : EmployeeDetailsDto
    {
        public long Id { get; set; }
    }
}
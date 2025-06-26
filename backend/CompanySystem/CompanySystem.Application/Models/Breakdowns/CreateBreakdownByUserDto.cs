using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CompanySystem.Application.Models.Breakdowns
{
    public class CreateBreakdownByUserDto {
        public string Description { get; set; } = null!;
        public long EmployeeId { get; set; }
    }
}

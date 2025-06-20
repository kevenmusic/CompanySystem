using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CompanySystem.Domain.Entities
{
    public class DepartmentEntity : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string ManagerFullName { get; set; } = null!;
        public virtual ICollection<BreakdownEntity> Breakdowns { get; set; } = new List<BreakdownEntity>();
    }
}

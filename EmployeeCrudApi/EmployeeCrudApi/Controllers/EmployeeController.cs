using EmployeeCrudApi.Data;
using EmployeeCrudApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace EmployeeCrudApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private ApplicationDbContext _context;
        private readonly Regex nameValidationRegex = new Regex(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'´]+$");
        private readonly Regex excessiveRepetitionRegex = new Regex(@"(.)\1{2,}"); // Detecta más de dos caracteres consecutivos iguales
        private readonly Regex noNumbersRegex = new Regex(@"\d"); // Detecta si hay algún número en el nombre

        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<Employee>> GetAll()
        {
            return await _context.Employees.ToListAsync();
        }

        [HttpGet]
        public async Task<Employee> GetById(int id)
        {
            return await _context.Employees.FindAsync(id);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Employee employee)
        {
            if (employee.Name.Length > 100)
            {
                return BadRequest("The maximum length for Name  is 100 characters.");
            }

            if (employee.Name.Length < 2)
            {
                return BadRequest("The Name must have at least 2 characters.");
            }

            if (!nameValidationRegex.IsMatch(employee.Name))
            {
                return BadRequest("The Name contains invalid characters.");
            }

            if (excessiveRepetitionRegex.IsMatch(employee.Name))
            {
                return BadRequest("The Name contains excessive repetition of characters.");
            }

            if (noNumbersRegex.IsMatch(employee.Name))
            {
                return BadRequest("The Name cannot contain numbers.");
            }

            employee.CreatedDate = DateTime.Now;
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task Update([FromBody] Employee employee)
        {
            Employee employeeToUpdate = await _context.Employees.FindAsync(employee.Id);
            employeeToUpdate.Name = employee.Name;
            await _context.SaveChangesAsync();
        }

        [HttpDelete]
        public async Task Delete(int id)
        {
            var employeeToDelete = await _context.Employees.FindAsync(id);
            _context.Remove(employeeToDelete);
            await _context.SaveChangesAsync();
        }
    }
}

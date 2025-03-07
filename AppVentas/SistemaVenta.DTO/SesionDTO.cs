using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.DTO
{
    public class SesionDTO
    {
        public int IdUsuario { get; set; }
        public string? NombreCompleto { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? NumTelefono { get; set; }
        public string? Correo { get; set; }
        public string? RolDescripcion { get; set; }
    }
}

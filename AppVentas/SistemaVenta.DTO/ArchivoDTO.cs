using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.DTO
{
    public class ArchivoDTO
    {
        public int IdArchivo { get; set; }
        public string Nombre { get; set; }
        public string Extension { get; set; }
        public byte[] ArchivoContenido { get; set; }
        public int IdUsuario { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SistemaVenta.DTO;

namespace SistemaVenta.BLL.Servicios.Contrato
{
    public interface IArchivoService
    {
        Task<ArchivoDTO> SubirArchivo(ArchivoDTO archivoDto);
        Task<List<ArchivoDTO>> ObtenerArchivosPorUsuario(int idUsuario);
    }
}

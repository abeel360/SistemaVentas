using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.DTO;
using SistemaVenta.API.Utilidad;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SistemaVenta.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArchivoController : ControllerBase
    {
        private readonly IArchivoService _archivoService;

        public ArchivoController(IArchivoService archivoService)
        {
            _archivoService = archivoService;
        }

        [HttpPost]
        [Route("Subir")]
        public async Task<IActionResult> SubirArchivo([FromForm] IFormFile archivo, [FromForm] int idUsuario)
        {
            var rsp = new Response<ArchivoDTO>();

            try
            {
                if (archivo == null || archivo.Length == 0)
                {
                    rsp.status = false;
                    rsp.msg = "Archivo no proporcionado o vacío.";
                    return BadRequest(rsp);
                }

                // Leer el archivo y convertirlo a byte[]
                byte[] archivoBytes;
                using (var ms = new MemoryStream())
                {
                    await archivo.CopyToAsync(ms);
                    archivoBytes = ms.ToArray();
                }

                // Crear el ArchivoDTO con los datos del archivo y el ID del usuario
                var archivoDto = new ArchivoDTO
                {
                    Nombre = archivo.FileName,
                    Extension = Path.GetExtension(archivo.FileName),
                    ArchivoContenido = archivoBytes,
                    IdUsuario = idUsuario
                };

                // Llamar al servicio para subir el archivo y guardar la relación con el usuario
                rsp.status = true;
                rsp.value = await _archivoService.SubirArchivo(archivoDto);
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = ex.Message;
            }

            return Ok(rsp);
        }

        [HttpGet]
        [Route("ArchivosPorUsuario/{idUsuario:int}")]
        public async Task<IActionResult> ArchivosPorUsuario(int idUsuario)
        {
            var rsp = new Response<List<ArchivoDTO>>();

            try
            {
                rsp.status = true;
                rsp.value = await _archivoService.ObtenerArchivosPorUsuario(idUsuario);

                if (rsp.value == null || rsp.value.Count == 0)
                {
                    rsp.status = false;
                    rsp.msg = "No se encontraron archivos para este usuario.";
                    return NotFound(rsp);
                }
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = ex.Message;
            }

            return Ok(rsp);
        }
    }
}

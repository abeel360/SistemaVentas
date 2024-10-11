using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.DTO;
using SistemaVenta.Model;

namespace SistemaVenta.BLL.Servicios
{
    public class ArchivoService : IArchivoService
    {
        private readonly IGenericRepository<Archivo> _archivoRepositorio;
        private readonly IGenericRepository<UsuarioArchivos> _usuarioArchivoRepositorio;
        private readonly IMapper _mapper;

        public ArchivoService(IGenericRepository<Archivo> archivoRepositorio, IGenericRepository<UsuarioArchivos> usuarioArchivoRepositorio, IMapper mapper)
        {
            _archivoRepositorio = archivoRepositorio;
            _usuarioArchivoRepositorio = usuarioArchivoRepositorio;
            _mapper = mapper;
        }

        public async Task<ArchivoDTO> SubirArchivo(ArchivoDTO archivoDto)
        {
            // Crear el archivo en la base de datos
            var archivo = _mapper.Map<Archivo>(archivoDto);
            await _archivoRepositorio.Crear(archivo);

            // Crear la relación entre el usuario y el archivo
            var usuarioArchivo = new UsuarioArchivos
            {
                IdUsuario = archivoDto.IdUsuario,
                IdArchivo = archivo.IdArchivo
            };
            await _usuarioArchivoRepositorio.Crear(usuarioArchivo);

            return _mapper.Map<ArchivoDTO>(archivo);
        }

        public async Task<List<ArchivoDTO>> ObtenerArchivosPorUsuario(int idUsuario)
        {
            // Consulta de los archivos relacionados con el usuario
            var queryusuarioArchivos = await _usuarioArchivoRepositorio
                .Consultar(ua => ua.IdUsuario == idUsuario);

            // Resuelve la tarea asincrónica antes de mapearla
            var listausuariosArchivos = await queryusuarioArchivos
                .Include(ua => ua.Archivo)
                .ToListAsync();

            // Aquí se mapea la lista resuelta, no el Task
            return _mapper.Map<List<ArchivoDTO>>(listausuariosArchivos);
        }
    }
}

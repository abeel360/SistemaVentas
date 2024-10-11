using System;
using System.Collections.Generic;

namespace SistemaVenta.Model;

public partial class UsuarioArchivos
{
    public int IdUsuario { get; set; }
    public int IdArchivo { get; set; }

    public Usuario Usuario { get; set; }
    public Archivo Archivo { get; set; }
}

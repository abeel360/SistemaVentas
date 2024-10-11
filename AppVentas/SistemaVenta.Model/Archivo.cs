using System;
using System.Collections.Generic;

namespace SistemaVenta.Model;

public partial class Archivo
{
    public int IdArchivo { get; set; }
    public string Nombre { get; set; }
    public string Extension { get; set; }
    public byte[] ArchivoContenido { get; set; }
    public int ProfileImage { get; set; }
}

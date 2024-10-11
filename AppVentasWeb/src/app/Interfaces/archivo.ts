export interface Archivo {
    idArchivo: number;
    nombre: string;
    extension: string;
    archivoContenido: ArrayBuffer; // Representación del contenido binario del archivo
    idUsuario: number; // Relaciona el archivo con un usuario
  }
  
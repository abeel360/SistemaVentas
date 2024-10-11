import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Archivo } from '../Interfaces/archivo'; // La interface creada
import { UsuarioArchivos } from '../Interfaces/usuario-archivos'; // Relación de Usuario y Archivos
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  private urlApi: string = environment.endpoint + "Archivo/";

  constructor(private http: HttpClient) { }

  // Subir archivo (devuelve el archivo subido con el id)
  subirArchivo(archivo: FormData): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Subir`, archivo);
  }

  // Obtener archivos por usuario
  obtenerArchivosPorUsuario(idUsuario: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}ArchivosPorUsuario/${idUsuario}`);
  }
}

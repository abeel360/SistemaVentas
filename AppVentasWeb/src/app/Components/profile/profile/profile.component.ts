import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArchivoService } from 'src/app/Services/archivo.service'; // Servicio para manejar archivos
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service'; // Servicio para manejar la sesión
import { Sesion } from 'src/app/Interfaces/sesion';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditarPerfilComponent } from '../../layout/Modales/modal-editar-perfil/modal-editar-perfil/modal-editar-perfil.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  // Información del usuario
  nombreUsuario: string = '';
  emailUsuario: string = '';

  // Formulario para subir archivo
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  imagenUsuario: string | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private archivoService: ArchivoService, // Servicio para subir archivo
    private utilidadService: UtilidadService,
    private dialog: MatDialog // Servicio para obtener datos del usuario
  ) {
    // Inicialización del formulario
    this.uploadForm = this.fb.group({
      archivo: [null, Validators.required] // Cambiado a 'archivo' para que coincida
    });
  }

  ngOnInit(): void {
    // Cargar información del usuario desde la sesión
    this.cargarDatosUsuario();
    this.cargarImagenUsuario();
  }

  // Método para cargar datos del usuario desde el localStorage
  cargarDatosUsuario(): void {
    const usuario: Sesion = this.utilidadService.obtenerSesionUsuario();
    if (usuario) {
      this.nombreUsuario = usuario.nombreCompleto;
      this.emailUsuario = usuario.correo;
    } else {
      console.error('No se pudo obtener la información del usuario');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Archivo seleccionado:', this.selectedFile);
      this.uploadForm.patchValue({
        archivo: this.selectedFile // Cambiado a 'archivo'
      });
      this.uploadForm.get('archivo')?.updateValueAndValidity(); // Actualiza la validez del control
    }
  }

  // Método para subir el archivo
  onSubmit(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('archivo', this.selectedFile);

      // Obtener el id del usuario logueado desde la sesión
      const usuario: Sesion = this.utilidadService.obtenerSesionUsuario();
      if (usuario && usuario.idUsuario) {
        formData.append('idUsuario', usuario.idUsuario.toString());

        this.archivoService.subirArchivo(formData).subscribe({
          next: (response) => {
            if (response.status) {
              this.utilidadService.mostrarAlerta('Archivo subido correctamente', 'Cerrar');
            }
          },
          error: (error) => {
            console.error('Error al subir el archivo:', error);
            this.utilidadService.mostrarAlerta('Hubo un problema al subir el archivo', 'Cerrar');
          }
        });
      } else {
        console.error('No se encontró el ID del usuario en la sesión');
        this.utilidadService.mostrarAlerta('Error: No se encontró el ID del usuario', 'Cerrar');
      }
    }
  }

  // Métodos existentes...
  verPerfil() {
    this.router.navigate(['/perfil']);
  }

  volverInicio(){
    this.router.navigate(['/pages']);
  }

  cerrarSesion() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }

  // Método para editar el perfil
  editarPerfil() {
    const dialogRef = this.dialog.open(ModalEditarPerfilComponent, {
      width: '400px',
      data: { currentImage: this.selectedFile ? URL.createObjectURL(this.selectedFile) : '' } // Pasa la imagen actual
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí puedes actualizar la imagen de perfil si la imagen ha sido cambiada
        // Por ejemplo, puedes hacer la llamada a tu servicio para subir la nueva imagen
        this.uploadForm.patchValue({ archivo: result });
        this.onSubmit(); // Opcional: podrías llamar al método para subir
      }
    });
  }

  cambiarContraseña() {
    console.log('Cambiando contraseña...');
  }

  cargarImagenUsuario(): void {
    const usuario: Sesion = this.utilidadService.obtenerSesionUsuario();
    if (usuario && usuario.idUsuario) {
      this.archivoService.obtenerArchivosPorUsuario(usuario.idUsuario).subscribe({
        next: (response) => {
          if (response.status && response.value.length > 0) {
            const archivo = response.value[0]; // Accede al primer archivo
            console.log('Archivo recibido:', archivo);
            
            if (archivo.archivoContenido) {
              // Asegúrate de que archivocontenido sea un Uint8Array o base64
              this.convertirBytesAURL(archivo.archivoContenido); // Convierte los bytes a URL
            } else {
              this.imagenUsuario = 'assets/default.png'; // Imagen por defecto si no hay archivo
            }
          } else {
            this.imagenUsuario = 'assets/default.png'; // Imagen por defecto si no hay archivos
          }
        },
        error: (error) => {
          console.error('Error al cargar la imagen:', error);
          this.imagenUsuario = 'assets/default.png'; // Imagen por defecto si hay un error
        }
      });
    } else {
      console.error('No se encontró el ID del usuario en la sesión');
      this.imagenUsuario = 'assets/default.png'; // Imagen por defecto
    }
  }

  convertirBytesAURL(base64: string): void {
    this.imagenUsuario = `data:image/jpeg;base64,${base64}`;
  }

  // ngOnDestroy para limpiar la URL
  ngOnDestroy(): void {
    if (this.imagenUsuario) {
        URL.revokeObjectURL(this.imagenUsuario);
    }
  }
  
}

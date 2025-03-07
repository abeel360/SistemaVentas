import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArchivoService } from 'src/app/Services/archivo.service'; // Servicio para manejar archivos
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service'; // Servicio para manejar la sesión
import { Sesion } from 'src/app/Interfaces/sesion';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-modal-editar-perfil',
  templateUrl: './modal-editar-perfil.component.html',
  styleUrls: ['./modal-editar-perfil.component.css']
})
export class ModalEditarPerfilComponent implements OnInit, AfterViewInit {

  // Información del usuario
  nombreUsuario: string = '';
  nombre: string = '';
  apellido: string = '';
  numTelf: string = '';
  emailUsuario: string = '';
  imagenUsuario: string | null = null;

  uploadForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModalEditarPerfilComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentImage: string },
    private fb: FormBuilder,
    private router: Router,
    private archivoService: ArchivoService, // Servicio para subir archivo
    private utilidadService: UtilidadService,
    private dialog: MatDialog // Servicio para obtener datos del usuario
  ) {
    // Inicializar el formulario
    this.uploadForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      archivo: [null, Validators.required] // Mantener el archivo, aunque en tu formulario HTML no lo uses directamente
    });
  }

  ngOnInit(): void {
    // Cargar información del usuario desde la sesión
    this.cargarDatosUsuario();
    this.cargarImagenUsuario();
  }

  ngAfterViewInit(): void {
    // Asegúrate de que los datos estén disponibles antes de mostrar el modal
    if (!this.nombreUsuario || !this.imagenUsuario) {
      setTimeout(() => {
        this.cargarDatosUsuario();
        this.cargarImagenUsuario();
      }, 100);
    }
  }

  // Método para cargar datos del usuario desde el localStorage
  cargarDatosUsuario(): void {
    const usuario: Sesion = this.utilidadService.obtenerSesionUsuario();
    if (usuario) {
      this.nombreUsuario = usuario.nombreCompleto;
      this.emailUsuario = usuario.correo;

      // Asignar los valores a los controles del formulario
      this.uploadForm.patchValue({
        firstName: usuario.nombreCompleto, // O el campo que corresponda
        email: usuario.correo,
        // Puedes agregar más campos si es necesario
      });
    } else {
      console.error('No se pudo obtener la información del usuario');
    }
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

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
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

  onCancel(): void {
    this.dialogRef.close(); // Cierra el modal sin hacer nada
  }

}

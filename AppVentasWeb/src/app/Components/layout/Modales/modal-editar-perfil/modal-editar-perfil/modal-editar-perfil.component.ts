import { Component, Inject } from '@angular/core';
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
export class ModalEditarPerfilComponent {

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
      archivo: [null, Validators.required] // Cambiado a 'archivo' para que coincida
    });
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

  onCancel(): void {
    this.dialogRef.close(); // Cierra el modal sin hacer nada
  }

}

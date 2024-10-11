import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private fb: FormBuilder
  ) {
    // Inicializar el formulario
    this.uploadForm = this.fb.group({
      imagen: [null, Validators.required]
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadForm.patchValue({
        imagen: this.selectedFile
      });
      this.uploadForm.get('imagen')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('imagen', this.selectedFile);

      // Aquí podrías hacer la llamada al servicio para subir la imagen
      // this.archivoService.subirImagen(formData).subscribe(...)

      this.dialogRef.close(this.selectedFile); // Cierra el modal y devuelve el archivo seleccionado
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Cierra el modal sin hacer nada
  }

}

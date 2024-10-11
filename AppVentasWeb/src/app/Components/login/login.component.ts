import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Login } from '../../Interfaces/login';
import { Router } from '@angular/router';
import { UsuarioService } from '../../Services/usuario.service';
import { UtilidadService } from '../../Reutilizable/utilidad.service';
import { AuthGuard } from 'src/app/auth.guard';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  formularioLogin:FormGroup;
  ocultarPassword:boolean = true;
  mostrarLoading:boolean = false;

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private _usuarioServicio:UsuarioService,
    private _utilidadServicio:UtilidadService,
    private _authGuard:AuthGuard
  ) {
    this.formularioLogin = this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required]
    })
  }

  ngOnInit(): void{
  }

  iniciarSesion(){
    this.mostrarLoading = true;

    const request:Login ={
      correo : this.formularioLogin.value.email,
      clave : this.formularioLogin.value.password
    }

    this._usuarioServicio.iniciarSesion(request).subscribe({
      next: (data) => {
        if(data.status){
          this._utilidadServicio.guardarSesionUsuario(data.value);
          this.router.navigate(["pages"])
        }else
          this._utilidadServicio.mostrarAlerta("No se encontraron coincidencias","Opps!")
        
      },
        complete : () =>{
          this.mostrarLoading = false
        },
        error : () =>{
          this._utilidadServicio.mostrarAlerta("Hubo un error","Opps!")
        }
    })
  }
}

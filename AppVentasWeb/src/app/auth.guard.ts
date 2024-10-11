import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UtilidadService } from './Reutilizable/utilidad.service'; // Asegúrate de tener un servicio que maneje la autenticación

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private utilidadService: UtilidadService) {}

  canActivate(): boolean {
    const usuario = this.utilidadService.obtenerSesionUsuario();
    
    if (usuario) {
      return true; // Si hay un usuario en la sesión, permite el acceso
    } else {
      this.router.navigate(['/login']); // Si no hay sesión, redirige a la página de login
      return false;
    }
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from '../../Reutilizable/shared/shared.module';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ModalUsuarioComponent } from './Modales/modal-usuario/modal-usuario.component';
import { ModalProductoComponent } from './Modales/modal-producto/modal-producto.component';
import { ModalDetalleVentaComponent } from './Modales/modal-detalle-venta/modal-detalle-venta.component';
import { ModalEditarPerfilComponent } from './Modales/modal-editar-perfil/modal-editar-perfil/modal-editar-perfil.component';

@NgModule({ declarations: [
    UsuarioComponent,
    VentaComponent,
    ReporteComponent,
    ProductoComponent,
    HistorialVentaComponent,
    DashBoardComponent,
    ModalUsuarioComponent,
    ModalProductoComponent,
    ModalDetalleVentaComponent,
    ModalEditarPerfilComponent
  ], imports: [CommonModule,
        LayoutRoutingModule,
        SharedModule,
        MatSidenavModule
        ] })
export class LayoutModule { }

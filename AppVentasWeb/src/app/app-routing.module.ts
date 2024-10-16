import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './Components/profile/profile/profile.component';

const routes: Routes = [
  {path:'',component: LoginComponent,pathMatch:"full"},
  {path:'login',component: LoginComponent,pathMatch:"full"},
  {path:'profile',component: ProfileComponent,pathMatch:"full"},
  {path:'pages',loadChildren:() => import("./Components/layout/layout.module").then(m => m.LayoutModule), canActivate: [AuthGuard]},
  {path:'**',redirectTo:'login',pathMatch:"full"}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './admin/admin.component';
import { ProductoComponent } from './admin/producto/producto.component';
import { ProveedoresComponent } from './admin/proveedores/proveedores.component';
import { ClientesComponent } from './admin/clientes/clientes.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'producto', component: ProductoComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: '', redirectTo: 'producto', pathMatch: 'full' }
    ]
  },
  { 
    path: 'admin-access',
    component: AdminComponent,
    children: [
      { path: 'producto', component: ProductoComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: '', redirectTo: 'producto', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'home' }
];

export { routes };

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

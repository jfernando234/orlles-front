import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './admin/admin.component';
import { ProductoComponent } from './admin/producto/producto.component';
import { ProveedoresComponent } from './admin/proveedores/proveedores.component';
import { ClientesComponent } from './admin/clientes/clientes.component';

const routes: Routes = [
//  { path: '', component: HomeComponent, pathMatch: 'full' },
//  { path: '**', redirectTo: '' } 
  { path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'producto', component: ProductoComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: '', redirectTo: 'producto', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
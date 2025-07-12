import { Component } from '@angular/core';
import { ProductoComponent } from "./producto/producto.component";
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { VentasComponent } from './ventas/ventas.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  imports: [ProductoComponent, ProveedoresComponent, VentasComponent, CommonModule],
  standalone: true
})
export class AdminComponent {
  constructor(private router: Router) {}

  mostrarProductoComponent = false;
  mostrarProveedoresComponent = true;
  mostrarVentasComponent = false;

  mostrarProducto() {
    this.mostrarProductoComponent = true;
    this.mostrarProveedoresComponent = false;
    this.mostrarVentasComponent = false;
  }

  mostrarProvedores() {
    this.mostrarProductoComponent = false;
    this.mostrarProveedoresComponent = true;
    this.mostrarVentasComponent = false;
  }
  mostrarVentas() {
    this.mostrarProductoComponent = false;
    this.mostrarProveedoresComponent = false;
    this.mostrarVentasComponent = true;
  }


  logout() {
    // Aquí puedes implementar la lógica de cierre de sesión
    console.log('Cerrando sesión...');

    // Eliminar el token de autenticación del almacenamiento local
    localStorage.removeItem('token');

    // Redirigir al usuario a la página de inicio de sesión
    this.router.navigate(['/login']);
  }
}

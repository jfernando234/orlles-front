import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  precioOriginal?: number;
  descuento?: number;
  cantidad: number;
  imagen: string;
  color?: string;
  selected?: boolean;
}

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, FormsModule, RouterModule,MatDialogModule,MatButtonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  // Datos mock del carrito con 5 productos
  cartItems: CartItem[] = [
    {
      id: 1,
      nombre: 'iPad Apple 11 Chip A16 Wi-Fi',
      precio: 1649,
      precioOriginal: 1799,
      descuento: 8,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/120x120/f0f0f0/333?text=iPad',
      color: 'Azul',
      selected: false // Solo el AirPods está seleccionado
    },
    {
      id: 2,
      nombre: 'MacBook Pro 14" M3',
      precio: 2299,
      precioOriginal: 2499,
      descuento: 8,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/120x120/f0f0f0/333?text=MacBook',
      color: 'Gris Espacial',
      selected: false // Solo el AirPods está seleccionado
    },
    {
      id: 3,
      nombre: 'iPhone 15 Pro Max',
      precio: 4899,
      precioOriginal: 5299,
      descuento: 8,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/120x120/f0f0f0/333?text=iPhone',
      color: 'Titanio Natural',
      selected: false // Solo el AirPods está seleccionado
    },
    {
      id: 4,
      nombre: 'Apple Watch Series 9',
      precio: 1499,
      precioOriginal: 1699,
      descuento: 12,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/120x120/f0f0f0/333?text=Watch',
      color: 'Rosa',
      selected: false // Solo el AirPods está seleccionado
    },
    {
      id: 5,
      nombre: 'AirPods Pro 2da Generación',
      precio: 899,
      precioOriginal: 999,
      descuento: 10,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/120x120/f0f0f0/333?text=AirPods',
      color: 'Blanco',
      selected: true // Solo este está seleccionado para que coincida con la imagen
    }
  ];
  showCartModal = false;
  // Nuevas propiedades para el carrito mejorado
  allSelected = false;
  totalWithWarranty = 0;
  total =0;
  cartCount = 0;
  showCheckoutModal = false;
  get subtotal(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((total, item) => {
        // Usar precio original si existe, sino usar precio actual
        const precioBase = item.precioOriginal || item.precio;
        return total + (precioBase * item.cantidad);
      }, 0);
  }
  closeCartModal() {
    this.showCartModal = false;
  }
  // Nuevos métodos para el carrito mejorado
  toggleSelectAll() {
    this.allSelected = !this.allSelected;
    // Aplicar selección a TODOS los items, no solo los visibles
    this.cartItems.forEach(item => {
      item.selected = this.allSelected;
    });
    this.updateTotals();
  }
  updateTotals() {
    // Calcular total con garantía usando el total correcto (con descuentos aplicados)
    const totalFinal = this.total; // Ya incluye descuentos

    // Asumiendo un costo de garantía de S/435 por producto seleccionado
    const warrantyBase = 435;
    const selectedItemsCount = this.getSelectedItemsCount();
    this.totalWithWarranty = totalFinal + (warrantyBase * selectedItemsCount);
  }
  getSelectedItemsCount(): number {
    return this.cartItems.filter(item => item.selected).length;
  }
  // Nuevos métodos para el carrito mejorado
  toggleItemSelection(item: CartItem) {
    item.selected = !item.selected;
    this.updateAllSelectedState();
    this.updateTotals();
  }
  updateAllSelectedState() {
    this.allSelected = this.cartItems.every(item => item.selected);
  }
  // Métodos para el carrito
  incrementQty(item: CartItem) {
    if (item.cantidad < 10) {
      item.cantidad++;
      this.updateCartCount();
    }
  }

  decrementQty(item: CartItem) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.updateCartCount();
    }
  }
  updateCartCount() {
    this.cartCount = this.cartItems.reduce((total, item) => total + item.cantidad, 0);
  }
  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    this.updateCartCount();
  }
  getDiscountAmount(): number {
    return this.cartItems
      .filter(item => item.selected && item.precioOriginal)
      .reduce((total, item) => {
        const discount = (item.precioOriginal! - item.precio) * item.cantidad;
        return total + discount;
      }, 0);
  }
  // Métodos para el modal de checkout
  proceedToCheckout(): void {
    this.closeCartModal();
    this.showCheckoutModal = true;

    // Cargar direcciones automáticamente al abrir checkout
    if (this.isAuthenticated) {
      console.log('Cargando direcciones para el checkout...');
      this.verificarDireccionesUsuario();
    } else {
      console.log('Usuario no autenticado, no se pueden cargar direcciones');
      this.mensajeDireccion = 'Debes iniciar sesión para gestionar direcciones';
      this.deliveryAddress = 'Inicia sesión para ver direcciones';
    }
  }
  verificarDireccionesUsuario(): void {
      if (!this.isAuthenticated) {
        return;
      }

      console.log('Verificando direcciones del usuario...');
        this.direccionesService.verificarDirecciones().subscribe({
        next: (response: DireccionResponse) => {
          console.log('Respuesta verificación direcciones:', response);
          this.tieneDirecciones = response.tieneDirecciones || false;
            if (this.tieneDirecciones) {
            // Si tiene direcciones, cargar la principal
            this.cargarDireccionPrincipal();
            // También cargar todas las direcciones para mostrar opciones
            this.cargarTodasLasDirecciones();
          } else {
            this.mensajeDireccion = 'Aún no cuentas con dirección registrada';
            this.deliveryAddress = 'Sin dirección registrada';
            this.direcciones = []; // Limpiar array
          }
        },
        error: (error: any) => {
          console.error('Error al verificar direcciones:', error);        this.tieneDirecciones = false;
          this.mensajeDireccion = 'Error al cargar direcciones';
          this.deliveryAddress = 'Sin dirección registrada';
          this.direcciones = [];
        }
      });
    }
}

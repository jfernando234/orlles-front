import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IProducto } from '../../../../shared/models/producto';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-content-detalle',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './content-detalle.component.html',
  styleUrl: './content-detalle.component.css'
})
export class ContentDetalleComponent {

  @Input() producto!: IProducto;
  @Output() volver = new EventEmitter<void>();
  cantidad: number = 1;

  volverALista() {
    this.volver.emit();
  }
  @Output() addToCart = new EventEmitter<{ producto: IProducto, cantidad: number }>();
  @Output() goToCart = new EventEmitter<void>();
  agregarAlCarrito() {
    this.addToCart.emit({ producto: this.producto, cantidad: this.cantidad });
  }

  irAlCarrito() {
    this.goToCart.emit();
  }
  decrement(): void {
    this.cantidad = this.cantidad > 1 ? this.cantidad - 1 : 1;
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-product',
  imports: [],
  templateUrl: './card-product.component.html',
  styleUrl: './card-product.component.css'
})
export class CardProductComponent {
   @Input() producto!: {
    ID_producto: number;
    Nombre: string;
    Marca: string;
    Especificaciones: string;
    Precio_unitario: number;
    ID_proveedor: number;
    Stock_minimo: number;
  };
}

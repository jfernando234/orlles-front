import { Component, Input } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { IProducto } from '../../../shared/models/producto';

@Component({
  selector: 'app-card-producto',
  imports: [NgIf, NgFor, NgClass],
  templateUrl: './card-producto.component.html',
  styleUrl: './card-producto.component.css',
  standalone: true
})
export class CardProductoComponent {
 @Input() producto!: IProducto;
  @Input() imagenUrl!: string;

}

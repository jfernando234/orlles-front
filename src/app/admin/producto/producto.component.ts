import { Component, OnInit, Inject } from '@angular/core';
import { CrudService } from '../crud/producto.service';

export interface Producto {
    ID_producto?: number; // Opcional, ya que puede ser autogenerado
    nombre: string;
    marca: string;
    especificaciones: string;
    precio: number;
    idproveedor: number;
    Stock?: number; 
}

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  productos: any[] = [];
  formData: any = {};
  editMode = false;
  selectedId: number | null = null;

  constructor(@Inject(CrudService) private crud: CrudService) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.productos = this.crud.getAll('productos');
  }

  onSubmit(): void {
    if (this.editMode && this.selectedId !== null) {
      this.crud.update('productos', this.selectedId, this.formData);
    } else {
      this.crud.add('productos', this.formData);
    }
    this.resetForm();
    this.loadProductos();
  }

  edit(producto: any): void {
    this.selectedId = producto.id;
    this.editMode = true;
  }

  delete(id: number): void {
    this.crud.delete('productos', id);
    this.loadProductos();
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {};
    this.editMode = false;
    this.selectedId = null;
  }
}



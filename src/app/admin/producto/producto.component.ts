import { Component, OnInit, Inject } from '@angular/core';
import { ProductoService } from '../../../shared/services/producto.services';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IProducto, IProductoC } from '../../../shared/models/producto';
import Swal from 'sweetalert2';
import { ProveedorService } from '../../../shared/services/proveedor.services';

@Component({
  standalone: true,
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  imports: [ReactiveFormsModule,CommonModule]
})
export class ProductoComponent implements OnInit {
  form!: FormGroup;
  editMode = false;
  selectedId: number | null = null;
  productos: any[] = [];
  proveedor: any[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  productoSeleccionado: any = null;
  constructor(
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['',Validators.required],
      marca: ['',Validators.required],
      precio: ['',Validators.required],
      proveedor: ['',Validators.required],
      stock: ['',Validators.required],
      especificaciones: ['',Validators.required],
    });

    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
      console.log(this.productos);
    });
    this.proveedorService.getProveedor().subscribe(data => {
      this.proveedor = data;
      console.log(this.proveedor);
    });
  }
  edit(producto: any): void {
    this.selectedId = producto.id;
    this.editMode = true;
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }
  guardarProducto(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Completa todos los campos obligatorios', 'warning');
      this.form.markAllAsTouched();
      return;
    }
    const producto : IProductoC = {
      nombre: this.form.value.nombre,
      marca: this.form.value.marca,
      precioUnitario: this.form.value.precio,
      idproveedor: this.form.value.proveedor,
      stockMinimo: this.form.value.stock,
      especificaciones: this.form.value.especificaciones
    };
    const formData = new FormData();
    formData.append('producto', new Blob([JSON.stringify(producto)], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }
    console.log(producto);
    this.productoService.agregarProducto(formData).subscribe(
      (response) => {
      if (response && response.isSuccess) {
        Swal.fire({
          title: 'Registrando...',
          allowOutsideClick: false,
        });
        Swal.showLoading();
        Swal.close();
        Swal.fire('Correcto', 'producto guardado', 'success');
        this.limpiarFormulario();
         this.productoService.getProductos().subscribe(data => {
        this.productos = data;
      });
      } else {
        Swal.fire('Error', response?.message || 'No se pudo guardar el producto', 'error');
      }
    },
    (error) => {
      console.error(error);
      Swal.fire('Error', 'Error de conexión o del servidor', 'error');
    });
  }

  seleccionarProducto(producto: any): void {
    this.productoSeleccionado = producto;
    this.selectedId = producto.id;
    this.form.patchValue({
      nombre: producto.nombre,
      marca: producto.marca,
      precio: producto.precioUnitario,
      proveedor: producto.idproveedor,
      stock: producto.stockMinimo,
      especificaciones: producto.especificaciones
    });
    this.imagePreview = producto.imagenUrl || null;
    this.editMode = true;
  }

  actualizarProducto(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Completa todos los campos obligatorios', 'warning');
      this.form.markAllAsTouched();
      return;
    }
    const productoActualizado: IProductoC = {
      ...(typeof this.selectedId === 'number' ? { id: this.selectedId } : {}),
      nombre: this.form.value.nombre,
      marca: this.form.value.marca,
      precioUnitario: this.form.value.precio,
      idproveedor: this.form.value.proveedor,
      stockMinimo: this.form.value.stock,
      especificaciones: this.form.value.especificaciones
    };
    const formData = new FormData();
    formData.append('producto', new Blob([JSON.stringify(productoActualizado)], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }
    this.productoService.actualizarProducto(formData).subscribe(
      (response: { isSuccess: boolean; message?: string }) => {
        if (response && response.isSuccess) {
          Swal.fire('Correcto', 'Producto actualizado', 'success');
          this.limpiarFormulario();
          this.productoService.getProductos().subscribe(data => {
            this.productos = data;
          });
        } else {
          Swal.fire('Error', response?.message || 'No se pudo actualizar el producto', 'error');
        }
      },
      (error: any) => {
        console.error(error);
        Swal.fire('Error', 'Error de conexión o del servidor', 'error');
      }
    );
  }

  eliminarProducto(): void {
    if (!this.selectedId) {
      Swal.fire('Error', 'Selecciona un producto para eliminar', 'warning');
      return;
    }
    this.productoService.eliminarProducto(this.selectedId).subscribe(
      (response: { isSuccess: boolean; message?: string }) => {
        if (response && response.isSuccess) {
          Swal.fire('Correcto', 'Producto eliminado', 'success');
          this.limpiarFormulario();
          this.productoService.getProductos().subscribe(data => {
            this.productos = data;
          });
        } else {
          Swal.fire('Error', response?.message || 'No se pudo eliminar el producto', 'error');
        }
      },
      (error: any) => {
        console.error(error);
        Swal.fire('Error', 'Error de conexión o del servidor', 'error');
      }
    );
  }

  editarProducto(): void {
    if (!this.selectedId) {
      Swal.fire('Error', 'Selecciona un producto para editar', 'warning');
      return;
    }
    this.actualizarProducto();
  }

  limpiarFormulario(): void {
    this.form.reset();
    this.selectedFile = null;
    this.imagePreview = null;
    this.editMode = false;
    this.selectedId = null;
  }
  getProveedorNombre(id: number): string {
  const prov = this.proveedor.find(p => p.id === id);
  return prov ? prov.nombre : '-';
}
}



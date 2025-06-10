import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  imports: [],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})

export class ClientesComponent implements OnInit {
  productos: any[] = [];
  proveedores: any[] = [];
  usuarios: any[] = [];
  selectedProductoId: number | null = null;
  selectedProveedorId: number | null = null;
  selectedUsuarioId: number | null = null;

  productoForm: FormGroup;
  proveedorForm: FormGroup;
  usuarioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productoForm = this.fb.group({
      nombre: [''],
      marca: [''],
      precio: [''],
      idProveedor: [''],
      cantidad: [''],
      especificaciones: ['']
    });

    this.proveedorForm = this.fb.group({
      nombre: [''],
      ruc: [''],
      direccion: [''],
      telefono: [''],
      email: [''],
      contacto: ['']
    });

    this.usuarioForm = this.fb.group({
      nombre: [''],
      username: [''],
      email: [''],
      password: [''],
      rol: [''],
      estado: ['']
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.productos = this.getLocalStorageData('productos');
    this.proveedores = this.getLocalStorageData('proveedores');
    this.usuarios = this.getLocalStorageData('usuarios');
  }

  getLocalStorageData(module: string): any[] {
    return JSON.parse(localStorage.getItem(module) || '[]');
  }

  createRecord(module: string, formValue: any) {
    const data = this.getLocalStorageData(module);
    const id = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
    formValue.id = id;
    data.push(formValue);
    localStorage.setItem(module, JSON.stringify(data));
    this.loadInitialData();
  }

  updateRecord(module: string, formValue: any) {
    const data = this.getLocalStorageData(module);
    const index = data.findIndex(item => item.id === (module === 'productos' ? this.selectedProductoId : (module === 'proveedores' ? this.selectedProveedorId : this.selectedUsuarioId)));
    if (index !== -1) {
      data[index] = { ...data[index], ...formValue };
      localStorage.setItem(module, JSON.stringify(data));
      this.loadInitialData();
    }
  }

  deleteRecord(module: string) {
    const data = this.getLocalStorageData(module);
    const updatedData = data.filter(item => item.id !== (module === 'productos' ? this.selectedProductoId : (module === 'proveedores' ? this.selectedProveedorId : this.selectedUsuarioId)));
    localStorage.setItem(module, JSON.stringify(updatedData));
    this.loadInitialData();
  }

  // Métodos para manejar la selección de tablas y la edición
}

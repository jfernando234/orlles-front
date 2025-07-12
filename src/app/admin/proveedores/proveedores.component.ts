import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IProveedor } from '../../../shared/models/proveedor';
import { ProveedorService } from '../../../shared/services/proveedor.services';


@Component({
  selector: 'app-proveedores',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent {
  form!: FormGroup
  proveedor: any[] = [];
  imagePreview: string | ArrayBuffer | null | undefined;
  selectedFile: any;
  selectedProveedor: IProveedor | null = null;
  proveedorSeleccionado: IProveedor | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombrerazon: ['', Validators.required],
      pais: ['', Validators.required],
      contacto: ['', Validators.required],
      correo: ['', Validators.required],
      telefono: ['', Validators.required],
      estado: ['', Validators.required],
      certificaciones: ['']
    });
    this.proveedorService.getProveedor().subscribe(data => {
      this.proveedor = data;
      console.log(this.proveedor);
    });
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
  guardarPorveedor(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Completa todos los campos obligatorios', 'warning');
      this.form.markAllAsTouched();
      return;
    }

    const proveedor: IProveedor = {
      nombre: this.form.value.nombrerazon,
      pais: this.form.value.pais,
      contacto: this.form.value.contacto,
      correoElectronico: this.form.value.correo,
      telefono: this.form.value.telefono,
      estado: this.form.value.estado
    };

    if (this.selectedProveedor) {
      // Actualizar proveedor existente
      proveedor.id = this.selectedProveedor.id;
      this.proveedorService.actualizarProveedor(proveedor).subscribe(
        (response: IProveedor) => {
          Swal.fire('Actualizado', 'Proveedor actualizado correctamente', 'success');
          const index = this.proveedor.findIndex(p => p.id === proveedor.id);
          if (index !== -1) {
            this.proveedor[index] = response;
          }
          this.cancelarEdicion();
        },
        (error: any) => {
          Swal.fire('Error', 'No se pudo actualizar el proveedor', 'error');
        }
      );
    } else {
      // Crear nuevo proveedor
      this.proveedorService.agregarProveedor(proveedor).subscribe(
        (response: IProveedor) => {
          if (response && response.id != null) {
            Swal.fire('Correcto', 'Proveedor guardado', 'success');
            this.proveedor.push(response);
          } else {
            Swal.fire('Error', 'No se pudo guardar el proveedor', 'error');
          }
        },
        (error: any) => {
          Swal.fire('Error', 'Error de conexión o del servidor', 'error');
        }
      );
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        console.log('Imagen seleccionada:', file);
        // Aquí puedes agregar lógica adicional para manejar la imagen seleccionada
    }
}

  seleccionarProveedor(proveedor: IProveedor): void {
    this.proveedorSeleccionado = proveedor;
    document.getElementById('proveedor-edit-btn')!.removeAttribute('disabled');
    document.getElementById('proveedor-delete-btn')!.removeAttribute('disabled');
  }

  editarProveedor(): void {
    if (this.proveedorSeleccionado) {
      this.form.patchValue({
        nombrerazon: this.proveedorSeleccionado.nombre,
        pais: this.proveedorSeleccionado.pais,
        contacto: this.proveedorSeleccionado.contacto,
        correo: this.proveedorSeleccionado.correoElectronico,
        telefono: this.proveedorSeleccionado.telefono,
        estado: this.proveedorSeleccionado.estado
      });
      document.getElementById('producto-submit-btn')!.innerText = 'Actualizar';
      document.getElementById('proveedor-cancel-btn')!.style.display = 'inline-block';
    }
  }

  cancelarEdicion(): void {
    this.selectedProveedor = null;
    this.form.reset();
    this.imagePreview = null;
    document.getElementById('producto-submit-btn')!.innerText = 'Agregar';
    document.getElementById('proveedor-cancel-btn')!.style.display = 'none';
    document.getElementById('proveedor-edit-btn')!.setAttribute('disabled', 'true');
    document.getElementById('proveedor-delete-btn')!.setAttribute('disabled', 'true');
  }

  eliminarProveedor(): void {
    if (this.proveedorSeleccionado) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.proveedorSeleccionado && this.proveedorSeleccionado.id !== undefined) {
            this.proveedorService.eliminarProveedor(this.proveedorSeleccionado.id).subscribe(
              () => {
                Swal.fire('Eliminado', 'El proveedor ha sido eliminado', 'success');
                this.proveedor = this.proveedor.filter(p => p.id !== this.proveedorSeleccionado!.id);
                this.proveedorSeleccionado = null;
                document.getElementById('proveedor-edit-btn')!.setAttribute('disabled', 'true');
                document.getElementById('proveedor-delete-btn')!.setAttribute('disabled', 'true');
              },
              (error) => {
                Swal.fire('Error', 'No se pudo eliminar el proveedor', 'error');
              }
            );
          } else {
            Swal.fire('Error', 'Proveedor no válido para eliminar', 'error');
          }
        }
      });
    }
  }
}

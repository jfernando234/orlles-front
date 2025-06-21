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
      tiempoentrega: ['', Validators.required],
      estado: ['', Validators.required],
      certificaciones: ['', Validators.required]
    });
    this.proveedorService.getProveedor().subscribe(data => {
      this.proveedor = data;
      console.log(this.proveedor);
    });
  }
  guardarPorveedor(): void {
      const proveedor : IProveedor = {
        nombre: this.form.value.nombrerazon,
        pais: this.form.value.pais,
        contacto: this.form.value.contacto,
        correoElectronico: this.form.value.correo,
        telefono: this.form.value.telefono,
        tiempoentrega: this.form.value.tiempoentrega,
        estado: this.form.value.estado,
        certificaciones: this.form.value.certificaciones
      };
      console.log(proveedor);
      this.proveedorService.agregarProveedor(proveedor).subscribe(
        (response) => {
          if (response.isSuccess) {
            Swal.fire({
              title: 'Registrando...',
              allowOutsideClick: false,
            })
            Swal.showLoading();
            Swal.close();
            Swal.fire('Correcto', 'producto guardado', 'success');
          } else {
            Swal.fire('Error', response.message, 'error');
          }
        },
        (error) => {
          console.error(error);
        });
    }

}

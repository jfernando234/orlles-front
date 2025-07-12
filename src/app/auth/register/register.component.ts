import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../core/header/header.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  showRegisterModal = false;
  registerForm: FormGroup;
  registerError: string | null = null;
  isAuthenticated = false;
  nombreUsuario = '';
  userRole = '';
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  constructor() {
    this.registerForm = this.fb.group({
        correoElectronico: ['', [Validators.required, Validators.email]],
        nombre: ['', [Validators.required, CustomValidators.onlyLetters]],
        apellidos: ['', [Validators.required, CustomValidators.onlyLetters]],
        tipoDocumento: ['DNI', Validators.required],
        numeroDocumento: ['', [Validators.required, CustomValidators.dynamicDocumentValidator('DNI')]],
        celular: ['', [Validators.required, CustomValidators.peruPhone]],
        contrasena: ['', [Validators.required, CustomValidators.strongPassword]]
    });
    this.registerForm.get('tipoDocumento')?.valueChanges.subscribe(tipo => {
        this.updateDocumentValidation(tipo);
    });
  }
  updateDocumentValidation(tipoDocumento: string) {
    const documentControl = this.registerForm.get('numeroDocumento');

    // Limpiar el campo
    documentControl?.setValue('');

    // Actualizar validadores
    documentControl?.setValidators([
      Validators.required,
      CustomValidators.dynamicDocumentValidator(tipoDocumento)
    ]);

    // Actualizar validación
    documentControl?.updateValueAndValidity();
  }

  checkAuthentication() {
    const usuario = localStorage.getItem('usuario');
    console.log('Usuario en localStorage:', usuario);

    if (usuario) {
      this.isAuthenticated = true;

      try {
        const usuarioObj = JSON.parse(usuario);
        this.nombreUsuario = usuarioObj.nombreCompleto || usuarioObj.nombreUsuario || usuarioObj.usuario || 'Usuario';
        this.userRole = usuarioObj.rol || '';
        console.log('Rol del usuario:', this.userRole);
      } catch (e) {
        this.nombreUsuario = usuario;
        this.userRole = '';
      }
    } else {
      this.isAuthenticated = false;
      this.nombreUsuario = '';
      this.userRole = '';
    }
  }
  register() {
    if (this.registerForm.valid) {
      const userData = {
        correoElectronico: this.registerForm.value.correoElectronico,
        nombre: this.registerForm.value.nombre,
        apellidos: this.registerForm.value.apellidos,
        tipoDocumento: this.registerForm.value.tipoDocumento,
        numeroDocumento: this.registerForm.value.numeroDocumento,
        celular: this.registerForm.value.celular,
        contrasena: this.registerForm.value.contrasena
      };

      this.authService.registrar(userData).subscribe({
        next: (response) => {
          this.closeRegisterModal();
          ////this.showLoginModal = true;
        },
        error: (error) => {
          this.registerError = error.error?.message || 'Error al registrar usuario';
        }
      });
    } else {
      this.registerError = 'Por favor, completa todos los campos correctamente';
    }
  }
  // Métodos para filtrar entrada de datos
  onNameInput(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Solo permitir letras, espacios y acentos
    value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');

    if (input.value !== value) {
      input.value = value;
      this.registerForm.get(field)?.setValue(value);
    }
  }

  onDNIInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    const tipoDocumento = this.registerForm.get('tipoDocumento')?.value;

    switch (tipoDocumento) {
      case 'DNI':
        // Solo permitir números, máximo 8 dígitos
        value = value.replace(/[^0-9]/g, '').slice(0, 8);
        // Si el primer dígito es 0, eliminarlo
        if (value.startsWith('0') && value.length > 1) {
          value = value.substring(1);
        }
        break;

      case 'CE':
        // Solo permitir números, máximo 9 dígitos, debe empezar con 0
        value = value.replace(/[^0-9]/g, '').slice(0, 9);
        // Si no empieza con 0, agregarlo
        if (value.length > 0 && !value.startsWith('0')) {
          value = '0' + value.substring(0, 8);
        }
        break;

      case 'PASSPORT':
        // Permitir letras y números, máximo 9 caracteres, convertir a mayúsculas
        value = value.replace(/[^A-Za-z0-9]/g, '').slice(0, 9).toUpperCase();
        break;
    }

    if (input.value !== value) {
      input.value = value;
      this.registerForm.get('numeroDocumento')?.setValue(value);

      // Forzar validación
      this.registerForm.get('numeroDocumento')?.markAsTouched();
      this.registerForm.get('numeroDocumento')?.updateValueAndValidity();
    }
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Solo permitir números, máximo 9 dígitos
    value = value.replace(/[^0-9]/g, '').slice(0, 9);

    // Si no empieza con 9, forzar que empiece con 9
    if (value.length > 0 && !value.startsWith('9')) {
      // Si escribió un número diferente a 9 como primer dígito, reemplazarlo por 9
      if (value.length === 1) {
        value = '9';
      } else {
        // Si ya había números, mantener solo los que están después del primer dígito
        value = '9' + value.substring(1);
      }
    }

    if (input.value !== value) {
      input.value = value;
      this.registerForm.get('celular')?.setValue(value);

      // Forzar validación
      this.registerForm.get('celular')?.markAsTouched();
      this.registerForm.get('celular')?.updateValueAndValidity();
    }
  }
  private isControlKey(event: KeyboardEvent): boolean {
    return event.key === 'Backspace' ||
           event.key === 'Delete' ||
           event.key === 'Tab' ||
           event.key === 'Escape' ||
           event.key === 'Enter' ||
           event.key === 'Home' ||
           event.key === 'End' ||
           event.key === 'ArrowLeft' ||
           event.key === 'ArrowRight' ||
           event.key === 'ArrowUp' ||
           event.key === 'ArrowDown' ||
           (event.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(event.key));
  }
  onKeyPress(event: KeyboardEvent, field: string) {
    const char = event.key;
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;

    // Permitir teclas de control
    if (this.isControlKey(event)) {
      return true;
    }

    switch (field) {
      case 'nombre':
      case 'apellidos':
        if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(char)) {
          event.preventDefault();
          return false;
        }
        break;
      case 'dni':
        const tipoDocumento = this.registerForm.get('tipoDocumento')?.value;

        switch (tipoDocumento) {
          case 'DNI':
            if (!/[0-9]/.test(char)) {
              event.preventDefault();
              return false;
            }
            // No permitir 0 como primer dígito
            if (char === '0' && currentValue.length === 0) {
              event.preventDefault();
              return false;
            }
            break;

          case 'CE':
            if (!/[0-9]/.test(char)) {
              event.preventDefault();
              return false;
            }
            // Solo permitir 0 como primer dígito
            if (currentValue.length === 0 && char !== '0') {
              event.preventDefault();
              return false;
            }
            break;

          case 'PASSPORT':
            if (!/[a-zA-Z0-9]/.test(char)) {
              event.preventDefault();
              return false;
            }
            break;
        }
        break;

      case 'celular':
        if (!/[0-9]/.test(char)) {
          event.preventDefault();
          return false;
        }
        // Solo permitir 9 como primer dígito
        if (currentValue.length === 0 && char !== '9') {
          event.preventDefault();
          return false;
        }
        break;
    }
    return true;
  }
  getNameError(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es obligatorio';
      if (control.errors['onlyLetters']) return 'Solo se permiten letras';
    }
    return '';
  }
  // Método para obtener placeholder dinámico
  getDocumentPlaceholder(): string {
    const tipoDocumento = this.registerForm.get('tipoDocumento')?.value;
    switch (tipoDocumento) {
      case 'DNI':
        return '12345678';
      case 'CE':
        return '012345678';
      case 'PASSPORT':
        return 'ABC123456';
      default:
        return 'Ingresa documento';
    }
  }
  // Método para obtener maxlength dinámico
  getDocumentMaxLength(): number {
    const tipoDocumento = this.registerForm.get('tipoDocumento')?.value;
    switch (tipoDocumento) {
      case 'DNI':
        return 8;
      case 'CE':
      case 'PASSPORT':
        return 9;
      default:
        return 9;
    }
  }

  getDNIError(): string {
    const control = this.registerForm.get('numeroDocumento');
    const tipoDocumento = this.registerForm.get('tipoDocumento')?.value;

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es obligatorio';

      switch (tipoDocumento) {
        case 'DNI':
          if (control.errors['invalidDNI']) return 'DNI inválido: debe tener 8 dígitos, no empezar con 0 y ser un número válido';
          break;
        case 'CE':
          if (control.errors['invalidCarnet']) return 'Carnet inválido: debe tener 9 dígitos y empezar con 0';
          break;
        case 'PASSPORT':
          if (control.errors['invalidPassport']) return 'Pasaporte inválido: debe tener 9 caracteres alfanuméricos';
          break;
      }
    }
    return '';
  }
  getPhoneError(): string {
    const control = this.registerForm.get('celular');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es obligatorio';
      if (control.errors['invalidPhone']) return 'Celular debe tener 9 dígitos y empezar con 9';
    }
    return '';
  }

  getPasswordError(): string {
    const control = this.registerForm.get('contrasena');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es obligatorio';
      if (control.errors['minLength']) return 'Mínimo 8 caracteres';
      if (control.errors['missingUpperCase']) return 'Debe contener al menos una mayúscula';
      if (control.errors['missingNumber']) return 'Debe contener al menos un número';
      if (control.errors['missingSpecialChar']) return 'Debe contener al menos un carácter especial';
    }
    return '';
  }
  switchToLogin() {
    this.closeRegisterModal();

  }
  closeRegisterModal() {
    this.showRegisterModal = false;
    this.registerForm.reset();
    this.registerError = null;
  }
}

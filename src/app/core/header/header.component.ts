import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

// Validadores personalizados
export class CustomValidators {
  static onlyLetters(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const onlyLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!onlyLettersRegex.test(value)) {
      return { onlyLetters: true };
    }
    return null;
  }
    static peruDNI(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    // Debe tener exactamente 8 dígitos
    if (!/^\d{8}$/.test(value)) {
      return { invalidDNI: true };
    }
    
    // No debe empezar con 0
    if (value.startsWith('0')) {
      return { invalidDNI: true };
    }
    
    // No debe ser un patrón muy simple (números consecutivos o repetidos)
    const consecutivePattern = /^(01234567|12345678|23456789|87654321|76543210|65432109|54321098|43210987|32109876|21098765|10987654)$/;
    if (consecutivePattern.test(value)) {
      return { invalidDNI: true };
    }
    
    // No debe tener todos los dígitos iguales
    const allSameDigits = /^(\d)\1{7}$/;
    if (allSameDigits.test(value)) {
      return { invalidDNI: true };
    }
    
    // Validación adicional: no debe ser menor a 10000000 (muy bajo)
    const numValue = parseInt(value);
    if (numValue < 10000000) {
      return { invalidDNI: true };
    }
    
    return null;
  }
  
  static peruPhone(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const phoneRegex = /^9\d{8}$/;
    if (!phoneRegex.test(value)) {
      return { invalidPhone: true };
    }
    return null;
  }
  
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    const hasMinLength = value.length >= 8;
    
    const errors: any = {};
    
    if (!hasUpperCase) errors.missingUpperCase = true;
    if (!hasNumber) errors.missingNumber = true;
    if (!hasSpecialChar) errors.missingSpecialChar = true;
    if (!hasMinLength) errors.minLength = true;
    
    return Object.keys(errors).length > 0 ? errors : null;
  }
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartCount = 0;
  searchTerm = '';
  showLoginModal = false;
  showRegisterModal = false;
  showCartModal = false;
  loginForm: FormGroup;
  registerForm: FormGroup;
  error: string | null = null;
  registerError: string | null = null;
  isAuthenticated = false;
  nombreUsuario = '';
  
  // Datos mock del carrito
  cartItems: CartItem[] = [
    {
      id: 1,
      nombre: 'MacBook Pro 2025',
      precio: 2499,
      cantidad: 2,
      imagen: 'https://via.placeholder.com/80x80/f0f0f0/333?text=MacBook'
    },
    {
      id: 2,
      nombre: 'Dell XPS 15',
      precio: 1499,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/80x80/f0f0f0/333?text=Dell+XPS'
    }
  ];
  
  // Getters para calcular totales
  get subtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }
  
  get igv(): number {
    return this.subtotal * 0.18;
  }
  
  get total(): number {
    return this.subtotal + this.igv;
  }

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
    
    this.registerForm = this.fb.group({
      correoElectronico: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, CustomValidators.onlyLetters]],
      apellidos: ['', [Validators.required, CustomValidators.onlyLetters]],
      tipoDocumento: ['DNI', Validators.required],
      numeroDocumento: ['', [Validators.required, CustomValidators.peruDNI]],
      celular: ['', [Validators.required, CustomValidators.peruPhone]],
      contrasena: ['', [Validators.required, CustomValidators.strongPassword]]
    });
  }

  ngOnInit() {
    this.checkAuthentication();
    this.updateCartCount();
  }

  checkAuthentication() {
    const usuario = localStorage.getItem('usuario');
    console.log('Usuario en localStorage:', usuario);
    
    if (usuario) {
      this.isAuthenticated = true;
      
      try {
        const usuarioObj = JSON.parse(usuario);
        this.nombreUsuario = usuarioObj.nombreCompleto || usuarioObj.nombreUsuario || usuarioObj.usuario || 'Usuario';
      } catch (e) {
        this.nombreUsuario = usuario;
      }
    } else {
      this.isAuthenticated = false;
      this.nombreUsuario = '';
    }
  }
  
  cerrarSesion() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.nombreUsuario = '';
    this.router.navigate(['/']);
  }

  updateCartCount() {
    this.cartCount = this.cartItems.reduce((total, item) => total + item.cantidad, 0);
  }

  onSearchClick() {
    console.log('Buscar:', this.searchTerm);
  }

  onLoginClick() {
    this.showLoginModal = true;
  }

  onRegisterClick() {
    this.showRegisterModal = true;
  }

  onCartClick() {
    this.showCartModal = true;
  }

  onCategoryClick(category: string) {
    console.log('Category clicked:', category);
  }

  closeLoginModal() {
    this.showLoginModal = false;
    this.loginForm.reset();
    this.error = null;
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
    this.registerForm.reset();
    this.registerError = null;
  }

  closeCartModal() {
    this.showCartModal = false;
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.closeLoginModal();
          this.checkAuthentication();
          this.router.navigate(['/']);
        },
        error: () => {
          this.error = 'Usuario o contraseña incorrectos';
        }
      });
    } else {
      this.error = 'Por favor, completa todos los campos';
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
          this.showLoginModal = true;
        },
        error: (error) => {
          this.registerError = error.error?.message || 'Error al registrar usuario';
        }
      });
    } else {
      this.registerError = 'Por favor, completa todos los campos correctamente';
    }
  }

  // Métodos para el carrito
  incrementQty(item: CartItem) {
    item.cantidad++;
    this.updateCartCount();
  }

  decrementQty(item: CartItem) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.updateCartCount();
    }
  }

  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    this.updateCartCount();
  }

  emptyCart() {
    this.cartItems = [];
    this.updateCartCount();
  }

  proceedToCheckout() {
    console.log('Proceder al pago');
    this.closeCartModal();
  }

  // Métodos para redes sociales
  loginWithFacebook() {
    console.log('Login con Facebook');
  }

  loginWithGoogle() {
    console.log('Login con Google');
  }

  loginWithTwitter() {
    console.log('Login con Twitter');
  }

  loginWithApple() {
    console.log('Login con Apple');
  }

  forgotPassword() {
    console.log('Recuperar contraseña');
  }
  
  switchToLogin() {
    this.closeRegisterModal();
    this.showLoginModal = true;
  }

  switchToRegister() {
    this.closeLoginModal();
    this.showRegisterModal = true;
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
    
    // Solo permitir números, máximo 8 dígitos
    value = value.replace(/[^0-9]/g, '').slice(0, 8);
    
    // Si el primer dígito es 0, eliminarlo
    if (value.startsWith('0') && value.length > 1) {
      value = value.substring(1);
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

  // Métodos para obtener mensajes de error personalizados
  getNameError(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es obligatorio';
      if (control.errors['onlyLetters']) return 'Solo se permiten letras';
    }
    return '';
  }
    getDNIError(): string {
    const control = this.registerForm.get('numeroDocumento');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es obligatorio';
      if (control.errors['invalidDNI']) return 'DNI inválido: debe tener 8 dígitos, no empezar con 0 y ser un número válido';
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
}

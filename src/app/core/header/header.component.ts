import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
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
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      tipoDocumento: ['DNI', Validators.required],
      numeroDocumento: ['', Validators.required],
      celular: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
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
}

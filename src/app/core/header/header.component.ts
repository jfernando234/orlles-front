import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  cartCount = 0;
  searchTerm = '';
  showLoginModal = false;
  loginForm: FormGroup;
  error: string | null = null;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }
  
  onLoginClick() {
    this.showLoginModal = true;
    console.log('Login clicked, showing modal');
  }

  onRegisterClick() {

    // Lógica para mostrar modal de registro
    console.log('Register clicked');
  }

  onCartClick() {
    // Lógica para mostrar carrito
    console.log('Cart clicked');
  }

  onSearchClick() {
    // Lógica para búsqueda
    console.log('Search clicked:', this.searchTerm);
  }
  onCategoryClick(category: string) {
    // Lógica para navegación por categoría
    console.log('Category clicked:', category);
  }

  closeLoginModal() {
    this.showLoginModal = false;
    this.loginForm.reset();
    this.error = null;
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Guardar token, usuario, roles si es necesario
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
          localStorage.setItem('roles', JSON.stringify(response.roles));
          this.closeLoginModal();
          this.router.navigate(['/dashboard']); // redireccionar a dashboard u otro componente
        },
        error: () => {
          this.error = 'Usuario o contraseña incorrectos';
        }
      });
    } else {
      this.error = 'Por favor, completa todos los campos';
    }
  }
}

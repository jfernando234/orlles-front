import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,MatDialogModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  isAuthenticated = false;
  nombreUsuario = '';
  userRole = '';
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<LoginComponent>
  ) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
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
  forgotPassword() {
    console.log('Recuperar contraseña');
  }

  closeLoginModal() {
    this.dialogRef.close();
  }
}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest } from '../models/login-request.model';
import { Usuario } from '../models/usuario.model';

interface LoginResponse {
  usuario?: string;
  roles?: string[];
  mensaje?: string;
  // Estructura que coincide con la base de datos
  id?: number;
  nombre_completo?: string;
  correo_electronico?: string;
  contrasena?: string;
  rol?: string;
  rol_id?: number;
  fecha_registro?: string;
  // También mantener compatibilidad con otras estructuras
  nombreCompleto?: string;
  correoElectronico?: string;
  nombreUsuario?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, data)
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          
          // Guardar toda la información del usuario
          localStorage.setItem('usuario', JSON.stringify(response));
          localStorage.setItem('authenticated', 'true');
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  registrar(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/registrar`, usuario);
  }
  logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('authenticated');
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): any | null {
    const userData = localStorage.getItem('usuario');
    return userData ? JSON.parse(userData) : null;
  }

  getRoles(): string[] {
    const user = this.getCurrentUser();
    return user && user.rol ? [user.rol] : [];
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user && user.rol === role;
  }

  private hasToken(): boolean {
    return localStorage.getItem('authenticated') === 'true';
  }
}


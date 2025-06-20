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
          // Determinar el nombre del usuario según la estructura de respuesta
          let nombreUsuario = '';
          let roles: string[] = [];
          
          if (response.usuario) {
            // Formato esperado del backend original
            nombreUsuario = response.usuario;
            roles = response.roles || [];
          } else if (response.nombre_completo) {
            // Formato de la base de datos actual
            nombreUsuario = response.nombre_completo;
            if (response.rol) {
              roles = [response.rol];
            }
          } else if (response.nombreCompleto) {
            // Formato anterior
            nombreUsuario = response.nombreCompleto;
            if (response.rol) {
              roles = [response.rol];
            }
          } else if (response.nombreUsuario) {
            nombreUsuario = response.nombreUsuario;
            if (response.rol) {
              roles = [response.rol];
            }
          }
          
          localStorage.setItem('usuario', nombreUsuario);
          localStorage.setItem('roles', JSON.stringify(roles));
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
    localStorage.removeItem('roles');
    localStorage.removeItem('authenticated');
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('usuario');
  }

  getRoles(): string[] {
    const rolesStr = localStorage.getItem('roles');
    return rolesStr ? JSON.parse(rolesStr) : [];
  }

  hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role);
  }

  private hasToken(): boolean {
    return localStorage.getItem('authenticated') === 'true';
  }
}


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DireccionDTO {
  id?: number;
  direccion: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  avenidaCalleJiron?: string;
  numero?: string;
  codigoPostal?: string;
  referencia?: string;
  esPrincipal?: boolean;
}

export interface DireccionResponse {
  success: boolean;
  data?: DireccionDTO | DireccionDTO[];
  message: string;
  hasAddresses?: boolean;
  hasPrincipalAddress?: boolean;
  totalAddresses?: number;
  tieneDirecciones?: boolean;
  cantidadDirecciones?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DireccionesService {
  private baseUrl = 'http://localhost:8080/api/direcciones';

  constructor(private http: HttpClient) { }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token encontrado:', token ? 'Sí' : 'No');
    console.log('Token value:', token);
    
    if (!token) {
      console.error('No se encontró token de autenticación');
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener todas las direcciones del usuario
  obtenerDirecciones(): Observable<DireccionResponse> {
    return this.http.get<DireccionResponse>(this.baseUrl, {
      headers: this.getHeaders()
    });
  }

  // Obtener dirección principal
  obtenerDireccionPrincipal(): Observable<DireccionResponse> {
    return this.http.get<DireccionResponse>(`${this.baseUrl}/principal`, {
      headers: this.getHeaders()
    });
  }

  // Verificar si el usuario tiene direcciones
  verificarDirecciones(): Observable<DireccionResponse> {
    return this.http.get<DireccionResponse>(`${this.baseUrl}/verificar`, {
      headers: this.getHeaders()
    });
  }

  // Crear nueva dirección
  crearDireccion(direccion: DireccionDTO): Observable<DireccionResponse> {
    return this.http.post<DireccionResponse>(this.baseUrl, direccion, {
      headers: this.getHeaders()
    });
  }

  // Actualizar dirección
  actualizarDireccion(id: number, direccion: DireccionDTO): Observable<DireccionResponse> {
    return this.http.put<DireccionResponse>(`${this.baseUrl}/${id}`, direccion, {
      headers: this.getHeaders()
    });
  }

  // Eliminar dirección
  eliminarDireccion(id: number): Observable<DireccionResponse> {
    return this.http.delete<DireccionResponse>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Establecer dirección como principal
  establecerComoPrincipal(id: number): Observable<DireccionResponse> {
    return this.http.put<DireccionResponse>(`${this.baseUrl}/${id}/principal`, {}, {
      headers: this.getHeaders()
    });
  }

  // Método helper para construir dirección completa
  construirDireccionCompleta(direccion: DireccionDTO): string {
    const partes: string[] = [];
    
    if (direccion.avenidaCalleJiron) {
      let parte = direccion.avenidaCalleJiron;
      if (direccion.numero) {
        parte += ` ${direccion.numero}`;
      }
      partes.push(parte);
    }
    
    if (direccion.distrito) {
      partes.push(direccion.distrito);
    }
    
    if (direccion.provincia) {
      partes.push(direccion.provincia);
    }
    
    if (direccion.departamento) {
      partes.push(direccion.departamento);
    }
    
    return partes.join(', ');
  }
}

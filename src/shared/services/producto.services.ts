import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError,throwError} from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { Usuario } from '../models/usuario.model';
import Swal from 'sweetalert2';
import { IProducto } from '../models/producto';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}
  agregarProducto(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos/crear`, formData);
  }
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos/GetAll`);
  }
  getImagenProducto(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/productos/${id}/imagen`, { responseType: 'blob' });
  }
  actualizarProducto(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/actualizar`, formData);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/eliminar/${id}`);
  }
}

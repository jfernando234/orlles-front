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
  getImagenUrl(id: number): string {
    return `http://localhost:8080/productos/imagen/${id}`;
  }
}

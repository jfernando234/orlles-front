import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { successResponse } from '../models/successResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

   apiUrl = 'https://localhost:44324/api';
  constructor(public http: HttpClient,) { }

  getProductos(): Observable<Product[]> {
   return this.http.get<Product[]>(`${this.apiUrl}/productos`);
  }

}

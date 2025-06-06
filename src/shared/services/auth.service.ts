import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  registrar(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, data);
  }

  logout() {
    localStorage.clear();
  }
}

import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { getApiConfig } from '@angular-monorepo/config';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: HttpParams): Observable<T> {
    console.log('GET URL:', getApiConfig('development').baseUrl + url);
    return this.http.get<T>(getApiConfig('development').baseUrl + url, {params});
  }

  post<T>(url: string, data: T): Observable<T> {
    return this.http.post<T>(getApiConfig('development').baseUrl + url, data);
  }

  put<T, J>(url: string, data: T): Observable<J> {
    return this.http.put<J>(getApiConfig('development').baseUrl + url, data);
  }
}


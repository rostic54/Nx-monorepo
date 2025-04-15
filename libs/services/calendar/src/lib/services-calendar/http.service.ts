import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { getApiConfig } from '@angular-monorepo/config';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly baseUrl = getApiConfig('development').baseUrl;
  constructor(private http: HttpClient) {}

  get<T>(
    url: string,
    withCredentials = true,
    params?: HttpParams
  ): Observable<T> {
    return this.http.get<T>(this.baseUrl + url, {
      params,
      withCredentials: withCredentials,
    });
  }

  post<T, J = T>(url: string, data: T, withCredentials = true): Observable<J> {
    const options = {
      withCredentials: withCredentials,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return this.http.post<J>(
      this.baseUrl + url,
      data,
      options
    );
  }

  put<T, J>(url: string, data: T): Observable<J> {
    return this.http.put<J>(this.baseUrl + url, data, {withCredentials: true});
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.baseUrl + url, {withCredentials: true});
  }
}
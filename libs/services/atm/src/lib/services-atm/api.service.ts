import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {delay, map, Observable, of} from "rxjs";

interface Response {
  results: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  postRequestCounter = 0;

  constructor(private http: HttpClient) {
  }

  get(url: string): Observable<any> {
    return this.http.get<Response>(url)
  }

  post(amount: number): Observable<boolean> {
    return of(amount).pipe(
      delay(2000),
      map(result => {
        this.postRequestCounter++;
        if( this.postRequestCounter % 2 === 0) {
          throw new Error('Technical issue')
        }
        return !!result
      })
    )
  }
}

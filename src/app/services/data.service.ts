import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Products } from '../interfaces/products';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private API: string = 'https://makeup-api.herokuapp.com/api/v1/products.json?product_category=powder&product_type=blush';

  constructor(private http: HttpClient) {}

  getData(): Observable<Products[]> {
    return this.http.get<Products[]>(this.API);
  }
}

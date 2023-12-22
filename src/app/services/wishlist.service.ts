import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  //private apiUrl = 'https://oj.greatfuturetechno.com/api/my_wish_list/';
  private apiUrl = 'https://hcb.gftpl.in/api/my_wish_list/';

  constructor(private http: HttpClient, private Token:TokenService) { }

  getWishlist(): Observable<any> {
    let headers:any=this.Token.getHeaders()
    return this.http.get<any>(this.apiUrl, headers);
  }
  
  addToWishlist(product: any): Observable<any> {
    let headers:any=this.Token.getHeaders()
    return this.http.post<any>(`${this.apiUrl}?product_id=${product}`, {}, headers);
  }

  removeFromWishlist(productId: string): Observable<any> {
    let headers:any=this.Token.getHeaders()

    const url = `${this.apiUrl}?product_id=${productId}`;
    return this.http.delete<any>(url, headers);
  }
}

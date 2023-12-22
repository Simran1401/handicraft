import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl: string;
  constructor(private http:HttpClient,private router:Router,private Token:TokenService) { 
    //this.apiUrl = 'https://oj.greatfuturetechno.com';
    this.apiUrl = 'https://hcb.gftpl.in';
  }
  loginRequest(contact: any){
    return this.http.post(`${this.apiUrl}/accounts/m/login/`,{"username":contact})
  }
  loginRequestOtp(contact: any,otp: any){
    return this.http.post(`${this.apiUrl}/accounts/m/login/confirm/`,{"username":contact,"otp":otp})
  }
  clientCredentials(){
    let headers:any = this.Token.getHeaders()
    if(headers) {
      return this.http.get(`${this.apiUrl}/accounts/user/`,headers)
    } else {
      return
    }
  }
  updateCredentials(id: string,body: any){
    let headers:any = this.Token.getHeaders()
    return this.http.put(`${this.apiUrl}/accounts/user/`+id+'/update/',body,headers)
  }
  logout(){
    let headers:any = this.Token.getHeaders()
    return this.http.post(`${this.apiUrl}/accounts/logout/`,'',headers)
  }
  remove(){
    localStorage.removeItem("auth")
    localStorage.removeItem("removed_products")
    localStorage.removeItem("area")
    localStorage.removeItem("cart")
    this.router.navigate(['/']).then(()=>window.location.reload())
  }
}
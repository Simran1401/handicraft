import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {}
  setToken(Token: any,username: any){
    localStorage.removeItem('auth');
    localStorage.setItem('auth',JSON.stringify({"accessToken":Token,"usename":username}))
  }
  getToken(){
    let token:any = localStorage.getItem('auth');
    return JSON.parse(token)
  }
  getHeaders(){
    let token
    let headers
    if(this.getToken()){ token=this.getToken().accessToken
    headers = { headers: new HttpHeaders({ 'Authorization': `Token ${token}`, 'Content-Type': 'application/json'})}
    }else{
      headers=""
    }
    return headers
  }
  getAuthHeaders(){
    let token
    let headers
    if(this.getToken()){ token=this.getToken().accessToken
    headers = { headers: new HttpHeaders({ 'Authorization': `Token ${token}`})}
    }else{
      headers=""
    }
    return headers
  }
}

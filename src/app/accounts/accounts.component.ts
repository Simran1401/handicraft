import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ProductApiService } from '../services/product-api.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent { 
  successMessage: any;
  done: boolean = false;
  request: boolean = false;
  show: boolean = false;
  myAccountDropdown = false;
  loading:boolean = false;

  constructor(private api: ProductApiService, private Token: TokenService, private login: LoginService) { }
  account: any;
  show_acc_details: boolean = false;

  ngOnInit(): void {
    if (this.Token.getHeaders()) {
      this.login?.clientCredentials()?.subscribe({
        next: (data) => {
        this.account = data;
      },  
      error: (err)=>{
         this.request=true;
         if(err?.status == '401'){ 
         localStorage.removeItem("auth");
          window.console.clear();
       window.location.reload() 
         }
        }
      })
    } else {
      this.request = true
    }
  }

  logout() {
    this.login.logout().subscribe(res => {
      window.location.reload()
    })
  }
  
}

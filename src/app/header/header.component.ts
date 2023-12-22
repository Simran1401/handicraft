import { Component, INJECTOR, OnInit, Renderer2, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { TokenService } from '../services/token.service';
import { ProductApiService } from '../services/product-api.service';
import { ProductsDataService } from '../services/product-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  constructor(private renderer: Renderer2, private cart: ProductsDataService, private api: ProductApiService, private Token: TokenService, private login: LoginService) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const nav = document.querySelector('.center-nav');
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition > 36) {
      this.renderer.addClass(nav, 'fixed-lower-nav');
    } else {
      this.renderer.removeClass(nav, 'fixed-lower-nav');
    }
  }


  successMessage: any;
  done: boolean = false;
  request: boolean = false;
  show: boolean = false;
  myAccountDropdown = false;
  totalamt: any;
  totalcount: any;
  cart$: any;
  footer: any;
  logo:any;


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
    this.cart.newCartItems.subscribe(() => {
      let totalamt = 0
      let totalcount = 0
      try {
        let cartt: any = localStorage.getItem('cart');
        this.cart$ = Object.values(JSON.parse(cartt))
        this.cart$.map((value: any) => { totalamt = totalamt + value["details"]["variation"]["discount_price"] * value["count"]; totalcount = totalcount + value["count"] + (value?.details?.variation?.addon_product ? value["count"] * 1 : 0) })
        this.totalamt = totalamt.toFixed(2)
        this.totalcount = totalcount
      } catch { }
    });

    this.api.getFooter().subscribe(
      (data: any) => {
        this.footer = data;
        console.log(data, 'footer');
      }
    );

    this.api.get_Logo().subscribe(
      (data: any) => {
        this.logo = data;
        console.log(data, 'logo');
      }
    );
  }

  openMyAccount() {
    this.myAccountDropdown = !this.myAccountDropdown;
  }
  logout() {
    this.login.logout().subscribe(res => {
      window.location.reload()
    })
  }
  
}
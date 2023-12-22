import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';
import { ProductsDataService } from '../services/product-data.service';
import { LoginService } from '../services/login.service';
import { TokenService } from '../services/token.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { delay } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  cart:any;
  account: any;
  loading:boolean = false;

  options: AnimationOptions = {
    path: '/assets/searchanimation.json',
  };
  error: boolean = false;

  constructor(private wishlistService: WishlistService, private productservice: ProductsDataService, private Token: TokenService, private login: LoginService) { }
 
  ngOnInit() {
    if (this.Token.getHeaders()) {
      this.login?.clientCredentials()?.subscribe({
        next: (data) => {
        this.account = data;
      },  
      error: (err)=>{ 
        //  this.request=true;
         if(err?.status == '401'){ 
         localStorage.removeItem("auth");
          window.console.clear();
       window.location.reload() 
         }
        }
      })
    } else {
      // this.request = true
    }
    this.productservice.itemQuantitySubject.subscribe(() => {
      let cartt: any = localStorage.getItem("cart");
      try {
        if (JSON.parse(cartt)) {
          this.cart = JSON.parse(cartt);
        } else {
          this.cart = {}
        }
      } 
      catch { this.cart = {} }
    });
    this.loading = true;
    this.wishlistService.getWishlist().pipe(delay(2000)).subscribe({
      next: (response) => {
        this.wishlist = response;
      },
      error: (error) => {
        console.error('Failed to get wishlist:', error);
        this.error = true;
      },
      complete: () => {
        this.loading = false
      }
  });
  }

  getWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (response) => {
        this.wishlist = response;
      },
      error: (error) => {
        console.error('Failed to get wishlist:', error);
        this.error = true;
      }
  });
  }

  getImagePath(str: any) {
    return `https://hcb.gftpl.in${str}`;
  }

  getDiscount(value:any){
    if(value.discount_percentage !== null){
      return Math.ceil(value.discount_percentage) + '%' + '+' + Math.ceil(value.get_discount);
    }
    return Math.ceil(value.get_discount);
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  } 

  addToWishlist(product: any) {
    this.wishlistService.addToWishlist(product).subscribe(
      () => {
        this.getWishlist(); // Refresh the wishlist after adding a product
      },
      (error) => {
        console.error('Failed to add to wishlist:', error);
      }
    );
  }

  removeFromWishlist(productId: string) {
    this.wishlistService.removeFromWishlist(productId).subscribe(
      () => {
        this.getWishlist(); // Refresh the wishlist after removing a product
      },
      (error) => {
        console.error('Failed to remove from wishlist:', error);
      }
    );
  }

  discount(value:any){
    let a,b,c;
    let s = value.variations;
    let x = (s.mrp - s.price)/s.mrp * 100
    let y = (s.price -s.discount_price)/s.price *100
    x = +x.toFixed(0)
    y = +y.toFixed(0)
    a =x?x:""
    b =y?y:""
    if(x && y ) {
      c = a +"% + "+ b+ "% OFF"
    } else if(x || y) {
      c = +a + +b +"% OFF"
    }
    return c
  }
  
  variation(value:any){
    return value.variations
  }

  addproduct(product: any, variation: any) {
    if (variation.stock_left > 0) {
      this.productservice.addToCartTwo(product, variation, 1);
      let cartt: any = localStorage.getItem('cart');
      try {
        if (JSON.parse(cartt)) {
          this.cart = JSON.parse(cartt);
        } else {
          this.cart = {}
        }
      } catch {
        this.cart = {}
      }
    }
  }


}

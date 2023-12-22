import { Component, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ProductApiService } from '../services/product-api.service';
import { ProductsDataService } from '../services/product-data.service';
import { forkJoin, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { WishlistService } from '../services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../services/token.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  wishlist: any[] = [];

  categories: any;
  brands: any;
  subcat: any;
  latest: any;
  cart: any;
  error: any;
  loader: any;
  features: any;
  numbers: any;
  about:any;
  faqs: any[] = []; 
  category_products:any;

  slideConfig = {
    "slidesToShow": 3, "slidesToScroll": 1,
    autoplay: false,
    dots: true,
    prevArrow: false, // Hide the previous arrow
    nextArrow: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slideToScroll: 1
        }
      }
    ]
  };

  banners: any;
  account: any;
  constructor(private toastr: ToastrService, private wishlistService: WishlistService, private renderer: Renderer2, private router: Router, private api: ProductApiService, private productservice: ProductsDataService, private Token: TokenService, private login: LoginService) { }

  ngOnInit() {
    if (this.Token.getHeaders()) {
      this.login?.clientCredentials()?.subscribe(data => {
        this.account = data;
      })
      // },err=>{
      //   this.request=true;
      //   if(err?.status == '401'){ 
      //   localStorage.removeItem("auth");
      //    window.console.clear();
      // window.location.reload() 
    }
    // } else {
    //   this.request = true
    // }

    // this.api.categoryApiCall().subscribe(data=>this.categories=data);
    // this.api.brandApiCall().subscribe(data=>{
    //   this.brands=data
    //   console.log('brands', data);
    // });
    // this.api.subcategoryApiCall().subscribe(data=>{
    //   this.subcat=data
    //   console.log(data, 'subcat');  
    // });
    // this.api.bannerNewApi().subscribe(data=>{
    //   this.banners = data;
    //   console.log(data, 'banners');
    // })
    // this.api.latest8Api().subscribe(data=>{
    //   this.latest = data;
    //   console.log(data, 'latest');
    // })
    this.getData()
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
    this.loadWishlist();


  }


  getData() {
    this.loader = true;
    const request1 = this.api.categoryApiCall().pipe(
      catchError((error) => {
        console.error('Error in category:', error);
        return of([]);
      }),
      delay(2000)
    );;
    const request2 = this.api.brandApiCall().pipe(
      catchError((error) => {
        console.error('Error in brands:', error);
        return of([]);
      }),
      delay(2000)
    );;
    const request3 = this.api.subcategoryApiCall().pipe(
      catchError((error) => {
        console.error('Error in subcategory', error);
        return of([]);
      })
    );;
    const request4 = this.api.bannerNewApi().pipe(
      catchError((error) => {
        console.error('Error in banner', error);
        return of([]);
      }),
      delay(2000)
    );;
    const request5 = this.api.latest8Api().pipe(
      catchError((error) => {
        console.error('Error in latest', error);
        return of([]);
      }),
      delay(2000)
    );;
    const request6 = this.api.get_Features().pipe(
      catchError((error) => {
        console.error('Error in features', error);
        return of([]);
      }),
      delay(2000)
    );;
    const request7 = this.api.get_company_in_number().pipe(
      catchError((error) => {
        console.error('Error in number', error);
        return of([]);
      }),
      delay(2000)
    );;
    const request8 = this.api.get_about().pipe(
      catchError((error) => {
        console.error('Error in about', error);
        return of([]);
      }),
      delay(2000)
    );;
    const request9 = this.api.get_faqs().pipe(
      catchError((error) => {
        console.error('Error in faqs', error);
        return of([]);
      }),
      delay(2000)
    );;
    const request10 = this.api.get_category_products().pipe(
      catchError((error) => {
        console.error('Error in category products', error);
        return of([]);
      }),
      delay(2000)
    );;
    

    forkJoin([request1, request2, request3, request4, request5, request6, request7,request8, request9,request10]).subscribe({
      next: (responses: any) => {
        // Handle the responses
        const response1 = responses[0];
        const response2 = responses[1];
        const response3 = responses[2];
        const response4 = responses[3];
        const response5 = responses[4];
        const response6 = responses[5];
        const response7 = responses[6];
        const response8 = responses[7];
        const response9 = responses[8]; 
        const response10 = responses[9]; 

        this.categories = response1;
        this.brands = response2;
        this.subcat = response3;
        this.banners = response4;
        this.latest = response5.filter((item:any) => item.variations !== null);
        this.features = response6;
        this.numbers = response7;
        this.about = response8;
        this.faqs = response9;
        this.category_products = response10;

        console.log('Response 1:', response1);
        console.log('Response 2:', response2);
        console.log('Response 3:', response3);
        console.log('Response 4:', response4);
        console.log('Response 5:', response5);
        console.log('Response 6:', response6);
        console.log('Response 7:', response7);
        console.log('Response 8:', response8);
        console.log('Response 9:', response9);
        console.log('Response 10:', response10);

      },
      error: (error: any) => {
        console.error('An error occurred during subscription:', error);
        this.error = true;
      },
      complete: () => {
        this.loader = false;
      }
    });

    
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (response) => {
        this.wishlist = response;
        console.log('called', response);
      },
      error: (error) => {
        console.error('Failed to get wishlist:', error);
      },
      complete: () => {
        // Call the checkButtons method here to update the button states
        //this.checkButtons();
      }
    });
  }

  checkButtons() {
    this.latest.forEach((product: any) => {
      product.inWishlist = this.isInWishlist(product.id);
    });
  }

  addToWishlist(product: any) {
    this.wishlistService.addToWishlist(product).subscribe({
      next: () => {
        this.loadWishlist();
        console.log('added');
        this.toastr.success("Added To wishlist.");
      },
      error: (error) => {
        console.error('Failed to add to wishlist:', error);
        this.toastr.error("Error while adding to wishlist.");
      }
    });
  }

  removeFromWishlist(productId: string) {
    this.wishlistService.removeFromWishlist(productId).subscribe(
      () => {
        this.loadWishlist();
        console.log('removed');
        this.toastr.success("Removed from wishlist.");
      },
      (error) => {
        console.error('Failed to remove from wishlist:', error);
        this.toastr.success("Error While Removing from wishlist.");
      }
    );
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist.some((item) => item.product_id.id === productId);
  }

  trimText(text: string) {
    if (text.length > 30) {
      return text.substring(0, 30) + '..';
    } else {
      return text;
    }
  }

  getImagePath(str: any) {
    return `https://hcb.gftpl.in${str}`;
  }

  variation(value: any) {
    return value.variations
  }

  //product logic
  addproduct(product: any, variation: any) {
    if (variation.stock_left > 0) {
      this.productservice.addToCartTwo(product, variation, 1);
      let cartt: any = localStorage.getItem('cart');
      try {
        if (JSON.parse(cartt)) {
          this.toastr.success("Product Added To Cart");
          this.cart = JSON.parse(cartt);
        } else {
          this.cart = {}
        }
      } catch {
        this.cart = {}
      }
    }
  }


  truncate(str: any) {
    let len = 20;
    if (str.length <= len) {
      return str;
    }
    return str.slice(0, len) + '...'
  };

  discount(value: any) {
    let a, b, c;
    let s = value?.variations;
    let x = (s?.mrp - s?.price) / s?.mrp * 100
    let y = (s?.price - s?.discount_price) / s?.price * 100
    x = +x.toFixed(0)
    y = +y.toFixed(0)
    a = x ? x : ""
    b = y ? y : ""
    if (x && y) {
      c = +a + +b + "% OFF"
    } else if (x || y) {
      c = +a + +b + "% OFF"
    }
    return c
  }

  getDiscount(value:any){
    if(value.discount_percentage !== null){
      return Math.ceil(value?.get_discount) + '%' + '+' + Math.ceil(value?.discount_percentage);
    }
    return Math.ceil(value.get_discount);
  }

  // discount(value: any) {
  //   let a, b, c;
  //   let s = value?.variations;
  //   let x = (s?.mrp - s?.price) / s?.mrp * 100
  //   let y = (s?.price - s?.discount_price) / s?.price * 100
  //   x = +x.toFixed(0)
  //   y = +y.toFixed(0)
  //   a = x ? x : ""
  //   b = y ? y : ""
  //   if (x && y) {
  //     c = +a + +b + "% OFF"
  //   } else if (x || y) {
  //     c = +a + +b + "% OFF"
  //   }
  //   return c
  // }
}
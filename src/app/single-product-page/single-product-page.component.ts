import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductApiService } from '../services/product-api.service';
import { ProductsDataService } from '../services/product-data.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../services/wishlist.service';
import { TokenService } from '../services/token.service';
import { LoginService } from '../services/login.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-single-product-page',
  templateUrl: './single-product-page.component.html',
  styleUrls: ['./single-product-page.component.css']
})
export class SingleProductPageComponent implements OnInit {

  constructor(private wishlistService: WishlistService, private route: ActivatedRoute, private api: ProductApiService, private productservice: ProductsDataService, private toastr: ToastrService, private Token: TokenService, private login: LoginService) { }
  wishlist: any[] = [];
  mainImage: string = '';

  products: any;
  more: boolean = false;
  variations: any;
  Index: any;
  error: boolean = false;
  keyspecs: any;
  t = 0;
  v_id: any = 0;
  more_like_this: any[] = [];
  loader: boolean = false;
  cart: any;
  currentQty: any = 1;

  addToCart = true;
  incDecBtn = false;
  blackIncDecBtn = false;
  blackAddToCart = true
  account:any;

  ngOnInit(): void {
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
    this.loader = true
    this.error = false
    this.more = true;
    this.productservice.itemQuantitySubject.subscribe(() => {
      let cartt: any = localStorage.getItem("cart");
      try {
        if (JSON.parse(cartt)) {
          this.cart = JSON.parse(cartt);
        } else {
          this.cart = {}
        }
      } 
      catch {
        this.toastr.error("Unable to fetch Cart");
      }
    });
    this.loadWishlist();

    //api 
    // this.Index=+this.route.snapshot.paramMap.get('productId');
    this.Index = Number(this.route.snapshot.paramMap.get('productId'))
    this.api.getProuductDetail(this.Index)
    .pipe(
      delay(2000) // Specify the desired delay duration in milliseconds
    )
    .subscribe({
      next: (data: any) => {
      console.log(data, 'product');
      this.products = data;
      this.mainImage = data.image;
      this.variations = this.products.variations;
      this.keyspecs = this.products.keyspecs;

      this.api.getSubCategoryList(data?.subcategory?.id).subscribe({
        next: (dataa: any) => {
        this.more_like_this = dataa.filter((item:any) => item.variations !== null);;
        console.log('more', dataa);
        this.loadWishlist();
      },
       error: (error: any) => {
          console.error('Error retrieving related products:', error);
        }
      });
    },
      error: (error: any) => {
        console.error('Error retrieving product details:', error);
        this.error = true;
      },
      complete: () => {
        this.loader = false;
      }
    });
  }

  changeMainImage(image: string): void {
    this.mainImage = image;
  }

  slideConfig = {
    "slidesToShow": 4, "slidesToScroll": 1,
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


  onSelect(event: any) {
    this.currentQty = event.target.value;
  }

  showAddToCart() {
    this.addToCart = true;
    this.incDecBtn = false;
  }

  showIncDecBtn() {
    this.addToCart = false;
    this.incDecBtn = true;
  }

  showBlackAddToCart() {
    this.blackAddToCart = true;
    this.blackIncDecBtn = false;
  }

  showBlackIncDecBtn() {
    this.blackAddToCart = false;
    this.blackIncDecBtn = true;
  }

  //product logic
  addproduct(product: any, variation: any, qty: any) {
    if (variation.stock_left > 0) {
      this.productservice.addToCartTwo(product, variation, +this.currentQty);
      let cartt: any = localStorage.getItem('cart');
      try {
        if (JSON.parse(cartt)) {
          this.cart = JSON.parse(cartt);
          this.toastr.success("Product Added To Cart");
        } else {
          this.cart = {}
        }
      } catch {
        this.cart = {}
      }
    }
  }
  removeproduct(product: any, variation: any) {
    this.productservice.removeFromCart(product, variation);
    try {
      let cartt: any = localStorage.getItem('cart');

      if (JSON.parse(cartt)) {
        this.cart = JSON.parse(cartt);
      } else {
        this.cart = {}
      }
    } catch {
      this.cart = {}
    }
  }
  increase(quantity: any, product: any, variation: any, qty: any) {
    if (quantity < variation.order_limit && quantity < variation.stock_left) {
      this.addproduct(product, variation, this.currentQty);
    }
  }

  //functions
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
    if(value?.discount_percentage !== null){
      return Math.ceil(value?.get_discount) + '%' + '+' + Math.ceil(value?.discount_percentage);
    }
    return Math.ceil(value?.get_discount);
  }

  variation(value: any) {
    return value.variations[this.v_id]
  }

  truncate(str: any) {
    let len = 20;
    if (str.length <= len) {
      return str;
    }
    return str.slice(0, len) + '...'
  };

  variationss(value: any) {
    return value.variations
  }

  //product logic
  addproduct1(product: any, variation: any) {
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

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (response) => {
        this.wishlist = response;
        console.log('called', response);
      },
    error:(error) => {
        console.error('Failed to get wishlist:', error);
      },
     complete: () => {
        // Call the checkButtons method here to update the button states
        //this.checkButtons();
      }
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

  createArrayUpToNumber(number:any) {
    var array = [];
    
    for (var i = 1; i <= number; i++) {
      array.push(i);
    }
    
    return array;
  }

}

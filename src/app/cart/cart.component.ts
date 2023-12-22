import { Component, OnInit } from '@angular/core';
import { ProductApiService } from '../services/product-api.service';
import { ProductsDataService } from '../services/product-data.service';
import { ToastrService } from 'ngx-toastr';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  event: any;
  numbers = [1, 2, 3, 4, 5];
  currentQty: any;

  options: AnimationOptions = {
    path: '/assets/emptyCartAnimation.json',
  };

  constructor(private productvalues: ProductsDataService, private toastr: ToastrService) { }
  cart: any;
  removed: any;
  minimumAmmount!: number;
  deliveryCharge!: number;
  totalMrp!: number;
  totalCount!: number;
  subTotal!: number;
  loading!: boolean;

  ngOnInit(): void {
    let areaa: any = localStorage.getItem('area');
    let cartt: any = localStorage.getItem('cart');
    let removed_productss: any = localStorage.getItem('removed_products');

    let content = JSON.parse(areaa)
    this.minimumAmmount = content?.minimum_order_amount
    this.deliveryCharge = content?.delivery_charges
    this.loading = true
    this.productvalues.updateCart().then(() => {
      this.loading = false
    })
    this.productvalues.newCartItems.subscribe(() => {
      try {
        let cartitem: any = localStorage.getItem('cart');

        this.cart = Object.values(JSON.parse(cartitem));
        let subTotal = 0;
        let totalMrp = 0;
        let totalCount = 0;
        this.cart.map((value: any) => {
          subTotal = subTotal + value["details"]["variation"]["discount_price"] * value["count"];
          totalCount = totalCount + value["count"] + (value["count"] * (value?.details?.variation?.addon_product ? 1 : 0));
          totalMrp = totalMrp + value["details"]["variation"]["mrp"] * value["count"]
        });
        this.totalMrp = +totalMrp.toFixed(2);
        this.subTotal = +subTotal.toFixed(2);
        this.totalCount = totalCount
      } catch { }

      try {
        this.removed = Object.values(JSON.parse(removed_productss))
      } catch { }
    })
    
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }  

  onSelect(event: any, value: any) {
    this.currentQty = event.target.value;
    this.updateproduct(value, event.target.value)
  }


  removeitem(value: any) {
    let removed_productss: any = localStorage.getItem('removed_products');
    let cartt: any = localStorage.getItem('cart');
    this.productvalues.removeItem(value)
    try {
      this.cart = Object.values(JSON.parse(cartt));
      let subTotal = 0;
      let totalMrp = 0;
      let totalCount = 0;
      this.cart.map((value: any) => {
        subTotal = subTotal + value["details"]["variation"]["discount_price"] * value["count"];
        totalCount = totalCount + value["count"] + (value["count"] * (value?.details?.variation?.addon_product ? 1 : 0));
        totalMrp = totalMrp + value["details"]["variation"]["mrp"] * value["count"]
      });
      this.totalMrp = +totalMrp.toFixed(2);
      this.subTotal = +subTotal.toFixed(2);
      this.totalCount = totalCount;
    } catch { }
    try {
      this.removed = Object.values(JSON.parse(removed_productss))
    } catch { }
  }

  increase(value: any) {
    let removed_productss: any = localStorage.getItem('removed_products');
    let cartt: any = localStorage.getItem('cart');
    if (value.count < value["details"]["variation"]["order_limit"] && value["count"] < value["details"]["variation"]["stock_left"]) {
      this.productvalues.addItem(value)
      try {
        this.cart = Object.values(JSON.parse(cartt));
        let subTotal = 0; let totalMrp = 0; let totalCount = 0;
        this.cart.map((value: any) => {
          subTotal = subTotal + value["details"]["variation"]["discount_price"] * value["count"];
          totalCount = totalCount + value["count"] + (value["count"] * (value?.details?.variation?.addon_product ? 1 : 0));
          totalMrp = totalMrp + value["details"]["variation"]["mrp"] * value["count"]
        });
        this.totalMrp = +totalMrp.toFixed(2);
        this.subTotal = +subTotal.toFixed(2);
        this.totalCount = totalCount
      } catch { }
      try { this.removed = Object.values(JSON.parse(removed_productss)) } catch { }
    }
  }

  remove(id: any) {

    let removed_productss: any = localStorage.getItem('removed_products');
    let cartt: any = localStorage.getItem('cart');
    this.productvalues.remove(id)
    try {
      this.cart = Object.values(JSON.parse(cartt));
      let subTotal = 0; let totalMrp = 0; let totalCount = 0;
      this.cart.map((value: any) => {
        subTotal = subTotal + value["details"]["variation"]["discount_price"] * value["count"];
        totalCount = totalCount + value["count"] + (value["count"] * (value?.details?.variation?.addon_product ? 1 : 0));
        totalMrp = totalMrp + value["details"]["variation"]["mrp"] * value["count"]
      });
      this.totalMrp = totalMrp;
      this.subTotal = subTotal;
      this.totalCount = totalCount
    } catch { }
    try { this.removed = Object.values(JSON.parse(removed_productss)) } catch { }
  }

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

  // discount(value: any) {
  //   let a, b, c
  //   let x = (value.mrp - value.price) / value.mrp * 100
  //   let y = (value.price - value.discount_price) / value.mrp * 100
  //   x = +x.toFixed(0)
  //   y = +y.toFixed(0)
  //   a = x ? x : ""
  //   b = y ? y : ""
  //   if (x && y) c = +a + +b + "% OFF"
  //   else if (x || y) c = +a + +b + "% OFF"
  //   return c
  // }

  counter(i: any) {
    return new Array(i)
  }

  addon(value: any) {
    return value?.details?.variation?.addon_product
  }

  updateproduct(variation: any, qty: any) {
    // if (variation.stock_left > 0) {
    console.log('wow')
    this.productvalues.updateProductCart(variation, +qty);
    let cartt: any = localStorage.getItem('cart');
    // try {
    //   if (JSON.parse(cartt)) {
    //     this.cart = JSON.parse(cartt);
    //   } else {
    //     this.cart = this.cart
    //   }
    // } catch {
    //   this.cart = {}
    // }
    // }
  }

  removeItemFromCart(value: any) {

    let removed_productss: any = localStorage.getItem('removed_products');
    let cartt: any = localStorage.getItem('cart');
    this.productvalues.removeItemComplete(value)
    // this.cart = Object.values(JSON.parse(cartt)); 
    this.toastr.success("Product Removed From Cart");
    let subTotal = 0;
    let totalMrp = 0;
    let totalCount = 0;
    this.cart.map((value: any) => {
      subTotal = subTotal + value["details"]["variation"]["discount_price"] * value["count"];
      totalCount = totalCount + value["count"] + (value["count"] * (value?.details?.variation?.addon_product ? 1 : 0));
      totalMrp = totalMrp + value["details"]["variation"]["mrp"] * value["count"]
    });
    this.totalMrp = +totalMrp.toFixed(2);
    this.subTotal = +subTotal.toFixed(2);
    this.totalCount = totalCount;
    this.removed = Object.values(JSON.parse(removed_productss))

    // try{
    //   this.removed = Object.values(JSON.parse(removed_productss))
    // }catch{}
  }

  createArrayUpToNumber(number: any) {
    var array = [];

    for (var i = 1; i <= number; i++) {
      array.push(i);
    }

    return array;
  }

}

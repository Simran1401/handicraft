import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { ProductApiService } from './product-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataService {

  constructor(private api:ProductApiService) { }
  public cartItemsSubject: BehaviorSubject<any> = new BehaviorSubject(null); public itemQuantitySubject: BehaviorSubject<any> = new BehaviorSubject(null); public newCartItems: BehaviorSubject<any> = new BehaviorSubject(null); public updateProducts: BehaviorSubject<any> = new BehaviorSubject(null); public update_loading: boolean = false; public update_error: boolean = false;
   

  updateProductCart(val:any, qty:any){
    let result:any={}
    console.log('val', val);
    let cart:any = localStorage.getItem('cart');
   if(JSON.parse(cart)){
     result=JSON.parse(cart);
     console.log('res', result[val.details.variation.id])
     result[val.details.variation.id].count = qty
   }
     localStorage.setItem("cart",JSON.stringify(result)); 
     this.itemQuantitySubject.next(null); 
     this.cartItemsSubject.next(null); 
     this.newCartItems.next(null); 
     this.updateProducts.next(null);
  }

  addToCartTwo(item:any,val:any, qty:any){
    let result:any={}
    let cart:any = localStorage.getItem('cart');
   if(JSON.parse(cart)){
     result=JSON.parse(cart);
     let count
     result[val.id]?count = result[val.id]["count"] : count = 0
     let data={
       count:count+qty,
       details:{
         "id":item.id,
         "brand":item.brand,
         "category":item.category,
         "subcategory":item.subcategory,
         "image":item.image,
         "title":item.title,
         "variation":val
       }
     };
     result[val.id]=data
   } else { 
     let data = { 
       count:qty,
       details:{
         "id":item.id,
         "brand":item.brand,
         "category":item.category,
         "subcategory":item.subcategory,
         "image":item.image,
         "title":item.title,
         "variation":val
       }
     }; 
     result[val.id]=data 
   }
     localStorage.setItem("cart",JSON.stringify(result)); 
     this.itemQuantitySubject.next(null); 
     this.cartItemsSubject.next(null); 
     this.newCartItems.next(null); 
     this.updateProducts.next(null);
   }
  
  addToCart(item:any,val:any){
     let result:any={}
     let cart:any = localStorage.getItem('cart');
    if(JSON.parse(cart)){
      result=JSON.parse(cart);
      let count
      result[val.id]?count = result[val.id]["count"] : count = 0
      let data={
        count:count+1,
        details:{
          "id":item.id,
          "brand":item.brand,
          "category":item.category,
          "subcategory":item.subcategory,
          "image":item.image,
          "title":item.title,
          "variation":val
        }
      };
      result[val.id]=data
    } else { 
      let data = { 
        count:1,
        details:{
          "id":item.id,
          "brand":item.brand,
          "category":item.category,
          "subcategory":item.subcategory,
          "image":item.image,
          "title":item.title,
          "variation":val
        }
      }; 
      result[val.id]=data 
    }
      localStorage.setItem("cart",JSON.stringify(result)); 
      this.itemQuantitySubject.next(null); 
      this.cartItemsSubject.next(null); 
      this.newCartItems.next(null); 
      this.updateProducts.next(null);
    }

  removeFromCart(item:any,val:any){
    let cart:any = localStorage.getItem('cart');
    let result = JSON.parse(cart)
    if(result[val.id] && result[val.id]["count"]>1){
      let count = result[val.id]["count"]
      let data = {
        count:count-1,
        details:{
          "id":item.id,
          "brand":item.brand,
          "category":item.category,
          "subcategory":item.subcategory,
          "image":item.image,
          "title":item.title,
          "variation":val
        }
      };
      result[val.id]=data
    } else { 
      delete result[val.id]
    }
    localStorage.setItem("cart",JSON.stringify(result)); 
    this.itemQuantitySubject.next(null); 
    this.cartItemsSubject.next(null); 
    this.newCartItems.next(null); 
    this.updateProducts.next(null);
  }

  addItem(value:any){
    let cart:any = localStorage.getItem('cart');
    let result = JSON.parse(cart)
    let data = {
      count:value.count+1,
      details:value.details
    }
    result[value['details']['variation']['id']] = data;
    localStorage.setItem("cart",JSON.stringify(result));
    this.itemQuantitySubject.next(null); 
    this.cartItemsSubject.next(null); 
    this.newCartItems.next(null); 
    this.updateProducts.next(null);
  }

  removeItemComplete(value:any){

    let cart:any = localStorage.getItem('cart');
    let result=JSON.parse(cart);    
    delete result[value['details']['variation']['id']]
    localStorage.setItem("cart",JSON.stringify(result)); 
    this.itemQuantitySubject.next(null); 
    this.cartItemsSubject.next(null); 
    this.newCartItems.next(null); 
    this.updateProducts.next(null);
  }

  removeItem(value:any){
    let cart:any = localStorage.getItem('cart');
    let result=JSON.parse(cart);
    if(result[value['details']['variation']['id']] && result[value['details']['variation']['id']]["count"]>1){
      let count = result[value['details']['variation']['id']]["count"]
      let data = {
        count:count-1,
        details:value.details
      };
      result[value['details']['variation']['id']] = data;
    } else { 
      delete result[value['details']['variation']['id']]
    }
    localStorage.setItem("cart",JSON.stringify(result)); 
    this.itemQuantitySubject.next(null); 
    this.cartItemsSubject.next(null); 
    this.newCartItems.next(null); 
    this.updateProducts.next(null);
  }
  
  async updateCart(){
    let cart:any = localStorage.getItem('cart');
    let removed:any = localStorage.getItem('removed_products');
    try{
    const keys=Object.values(JSON.parse(cart))
    let removed_keys:any;
    try{
    removed_keys=Object.values(JSON.parse(removed))
    }catch{}
    if(removed_keys?.length) removed_keys.map((val:any)=>keys.push(val))
    let var_list="0"
    keys.map((value:any)=>{var_list=var_list+","+value["details"]["variation"]["id"]})
    
    this.api.getCartDetails(var_list).subscribe((value:any)=>{
      let result:any = {}
      let removed:any = {}
      if(value){
      keys.map((item:any)=>{
        let details=item["details"]
        if(value[item['details']?.variation?.id]) {
          details["variation"] = value[item['details']['variation']['id']] 
        }
        let data={count:item["count"],details:details}
        if(value[item['details']?.variation?.id]?.stock_left>0) { 
          result[item['details']['variation']['id']]=data 
        } else { 
          removed[item['details']['variation']['id']]=data
        }
      })
      localStorage.setItem("cart",JSON.stringify(result))
      localStorage.setItem("removed_products",JSON.stringify(removed))
      this.itemQuantitySubject.next(null);
      this.cartItemsSubject.next(null); 
      this.newCartItems.next(null); 
      this.updateProducts.next(null);
      }
    }
    //,err=>err
    )
  }catch{}
  }

  remove(id:any){
    let cart:any = localStorage.getItem('removed_products');
    let result = JSON.parse(cart)
    delete result[id]
    localStorage.setItem('removed_products',JSON.stringify(result)); 
    this.itemQuantitySubject.next(null); 
    this.cartItemsSubject.next(null); 
    this.newCartItems.next(null); 
    this.updateProducts.next(null);
  }
}
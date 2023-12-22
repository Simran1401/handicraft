import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { Title } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  apiUrl:string;
  apiUrl2:string;

  constructor(private http:HttpClient,private Token:TokenService,private router:Router, private titleService:Title) {
    this.apiUrl = 'https://ec.greatfuturetechno.com/api';
    //this.apiUrl2 = 'https://oj.greatfuturetechno.com';
    this.apiUrl2 = 'https://hcb.gftpl.in';

   }
  //home page
  categoryApiCall(){
    return this.http.get(this.apiUrl2 + '/api/categories/');
  }
  latest8Api(){
    return this.http.get(this.apiUrl2 + '/api/latest_8_product');    
  }
  bannerNewApi(){
    return this.http.get(this.apiUrl2 + '/api/banners/');
  }
  brandApiCall(){
    return this.http.get(this.apiUrl2 + '/api/brands/');
  }
  subcategoryApiCall(){
    return this.http.get(this.apiUrl2 + '/api/subcategories/');
  }
  getBlogList(){
    return this.http.get(`${this.apiUrl2}/api/blogs/`);
  }
  getOffersList(){
    return this.http.get(this.apiUrl2 + '/api/offers/');
  }
  getCartDetails(id:any){
    return this.http.get(this.apiUrl2 + '/api/cart-update?vars='+id); 
  }
  bannerApiCall(){
    return this.http.get(this.apiUrl2 + "/api/banners/")
  }
  minibanner(){
    return this.http.get(this.apiUrl2 + "/api/mini-banners/")
  }
  getStaticPages(url: string){
    return this.http.get(this.apiUrl2 + "/api/static-pages"+url+"/")
  }
  // async _get(url: string){
  //   try{
  //   return await this.http.get(url,{responseType:"json"}).toPromise()
  //   }catch{
  //   }
  // }
  // async getUrl(url: string){
  //   try{
  //   return await this.http.get(url,{responseType:"json"}).toPromise();
  //   }catch{
  //     this.router.navigate(['/serversideornetworkerrorpage'],{skipLocationChange:true});
  //   }
  // }

  //products page
  getProuductDetail(n: string){
    return this.http.get(this.apiUrl2 + '/api/products/'+n+'/'); 
  }
  getCategoryList(category: string){
    return this.http.get(this.apiUrl2 + '/api/products/of/cats?cats='+category)
  }
  getSubCategoryList(subCategory: string){
    return this.http.get(this.apiUrl2 + '/api/products/of/subcats?subcats='+subCategory); 
  }
  getBrandList(brand: string){
    return this.http.get(this.apiUrl2 + '/api/products/of/brands?brands='+brand); 
  }
  getSearchList(search: string){
    return this.http.get(this.apiUrl2 + '/api/products/s/'+search+'/')
  }
  getTopSaver(){
    return this.http.get(this.apiUrl2 + "/api/top-savers/")
  }
  getCombos(){
    return this.http.get(this.apiUrl2 + "/api/combos/")
  }
  getSchemes(){
    return this.http.get(this.apiUrl2 + "/api/schemes/")
  }
  getReasons(){
    return this.http.get(this.apiUrl2 + "/api/return-reasons/")
  }
  // getFilteredData(brand: any,category: any,searchId: string,subcategory: any,other: string){
  //   if(category) return this.getCategoryList(category)
  //   else if(brand) return this.getBrandList(brand)
  //   else if(searchId){ this.titleService.setTitle("Search | "+searchId); return this.getSearchList(searchId)}
  //   else if(subcategory) return this.getSubCategoryList(subcategory)
  //   else if(other){ this.titleService.setTitle("Click 4 Needs | "+other); return this.others(other)}
  // }
  // //others
  // others(string: string){
  //   if(string?.toLowerCase()==="top saver") return this.getTopSaver()
  //   if(string?.toLowerCase()==="combos") return this.getCombos()
  //   if(string?.toLowerCase()==="offers") return this.getOffersList()
  // }

  //checkout
  paytmConfirm(data: any){
    return this.http.post('https://ec.greatfuturetechno.com/api/paytm_payment/',data)
  }

  razorpayConfirm(data: any){
    return this.http.post('https://ec.greatfuturetechno.com/api/payment/',data)
  }

  stepOneOrder(pm_id: any, ds_id: any, data: any){
    //let token = this.Token.getToken();
    let token = 'e6725905ba9e7ae07a0ab382355807a198878d17';
    //let headers_object = new HttpHeaders().set("Authorization", "Token " + token);
    const http_options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    };
    let json=`{"payment_method":"${pm_id}","delivery_slot":"${ds_id}","json":"${data}"}`
    return this.http.post('https://ec.greatfuturetechno.com/api/create-order/',json,http_options)
  }

  stepOneOrderr(data: any){
    let token = 'dd5ce9043fd0f31b721a945c3eed447a05405e1f';
    //let headers_object = new HttpHeaders().set("Authorization", "Token " + token);
    const http_options = { 
      headers: {
        'Authorization': `Token ${token}`
      }
    }; 
    //let json=`{"payment_method":"${pm_id}","delivery_slot":"${ds_id}","json":"${data}"}`
    return this.http.post('https://ec.greatfuturetechno.com/api/create-order/',data,http_options)
  }
 
  createOrder(data:any){
    let headers:any = this.Token.getAuthHeaders();
    return this.http.post(`${this.apiUrl2}/api/create-order/`, data, headers);
  }
  confirmRazorpay(data: any){
    return this.http.post('https://ec.greatfuturetechno.com/api/payment/',data)
  }

  getPincodes(){
    return this.http.get(`${this.apiUrl2}/api/pincodes/`)
  }
  getPincodeDetails(pin: string){
    return this.http.get(`${this.apiUrl2}/api/check-pincode/`+pin+'/')
  }
  postAddress(data: any,city: { id: any; },state: { id: any; },pincode: any){
    let headers:any=this.Token.getHeaders()
    let regex=new RegExp("\n","g")
    let json=`{"name":"${data.get("name").value}","mobile":"${data.get("contact").value}","address":"${data.get("address").value.replace(regex," ")}","locality":"${data.get("locality").value.replace(regex," ")}","landmark":"${(data?.get("landmark")?.value)?data.get("landmark").value.replace(regex," "):""}","pincode":"${pincode}","city":"${city.id}","state":"${state.id}","area":"${data.get("area").value}"}`
    return this.http.post(`${this.apiUrl2}/accounts/address/`,json,headers)
  }
  putAddress(data: any,city: { id: any; },state: { id: any; },pincode: any,id: string){
    let headers:any=this.Token.getHeaders()
    let regex=new RegExp("\n","g")
    let json=`{"name":"${data.get("name").value}","mobile":"${data.get("contact").value}","address":"${data.get("address").value.replace(regex," ")}","locality":"${data.get("locality").value.replace(regex," ")}","landmark":"${(data?.get("landmark")?.value)?data.get("landmark").value.replace(regex," "):""}","pincode":"${pincode}","city":"${city.id}","state":"${state.id}","area":"${data.get("area").value}"}`
    return this.http.put(`${this.apiUrl2}/accounts/address/`+id+'/update/',json,headers)
  }
  putAddress2(data:any, id:any){
    const headers:any = this.Token.getAuthHeaders()
    return this.http.put(`${this.apiUrl2}/accounts/address/?id=${id}`, data, headers);
  }
  getDeliverySlots(){
    return this.http.get(`${this.apiUrl2}/delivery-slots/`)
  }
  getPaymentMethods(){
    //return this.http.get("https://live.clickforneeds.com/api/payment-methods/")
    return this.http.get(`${this.apiUrl2}/api/payment-methods/`)
  }
  getAddress(){
    let headers:any=this.Token.getHeaders()
    return this.http.get(`${this.apiUrl2}/accounts/address/`,headers)
  }
  updatePrimaryAddress(id: any){
    let headers:any=this.Token.getHeaders()
    let body={"id":id}
    return this.http.post(`${this.apiUrl2}/accounts/address-set-primary/`,body,headers)
  }
  deleteAddress(id: any){
    let headers:any=this.Token.getHeaders()
    let body={"id":id}
    return this.http.post(`${this.apiUrl2}/accounts/address-delete/`,body,headers)
  }
  validateCoupon(code: any){
    let headers:any=this.Token.getHeaders()
    return this.http.post(`${this.apiUrl2}/api/verify-coupon/`,{"coupon":code},headers)
  }
  checkout(data: any[],slot: any,pay_method: any){
    let json: { product: any; product_var: any; quantity: any; }[]=[],body,headers:any=this.Token.getHeaders()
    data.map((val: { [x: string]: { [x: string]: { [x: string]: any; }; }; })=>json.push({'product':val['details']['id'],'product_var':val['details']['variation']['id'],'quantity':(val['count']<=val['details']['variation']['stock_left'])?val['count']:val['details']['variation']['stock_left']}))
    body={json:JSON.stringify(json),delivery_slot:slot,payment_method:pay_method}
    return this.http.post(`${this.apiUrl2}/api/create-order/`,body,headers)
  }

  //new address
  add_addressOJ(formData:any){
    const headers:any = this.Token.getAuthHeaders()
    const body = formData;
    return this.http.post(`${this.apiUrl2}/accounts/address/`,body,headers)
  }
  //myaccount
  orders_returns(){
    const headers:any=this.Token.getAuthHeaders()
    return this.http.get(`${this.apiUrl2}/api/orders/`,headers)
  }
  company_details(){
    const headers:any=this.Token.getAuthHeaders()
    return this.http.get(`${this.apiUrl2}/accounts/company_detail/`,headers)
  }
  return_order(formData: any){
    const headers:any = this.Token.getAuthHeaders()
    const body = formData
    return this.http.post(`${this.apiUrl2}/api/return-order/`,body,headers)
  }
  get_balance(){
    const headers:any = this.Token.getAuthHeaders()
    return this.http.get(`${this.apiUrl2}/accounts/user/wallet/`,headers)
  }
  get_wallet_details(){
    const headers:any = this.Token.getAuthHeaders()
    return this.http.get(`${this.apiUrl2}/accounts/user/wallet-with-logs/`,headers)
  }
  get_cancellation_reasons(){
    return this.http.get(`${this.apiUrl2}/api/order-cancellation-reasons/`)
  }
  cancel_order(order_id: any,reason: any){
    const headers:any = this.Token.getAuthHeaders()
    const body = {"order_id":order_id,"cancel_reason":reason}
    return this.http.post(`${this.apiUrl2}/api/cancel-order/`,body,headers)
  } 
  get_returns(){
    const headers:any = this.Token.getAuthHeaders()
    return this.http.get(`${this.apiUrl2}/api/returns/`,headers)
  }

  get_Features(){
    return this.http.get(this.apiUrl2 + '/api/features');
  }

  get_company_in_number(){
    return this.http.get(this.apiUrl2 + '/api/company_in_number');
  }

  getFooter(){
    return this.http.get(this.apiUrl2 + '/api/footer');
  }

  check_order_status(data:any){
    let headers:any = this.Token.getAuthHeaders();
    return this.http.post(`${this.apiUrl2}/api/payment_status_check/`, data, headers);
  }

  get_about(){
    return this.http.get(this.apiUrl2 + '/api/about_feature/');
  }

  get_faqs(){
    return this.http.get(this.apiUrl2 + '/api/faq/');
  }

  get_Blogs() {
    return this.http.get(`${this.apiUrl2}/api/blog/`);
  }
  
  getBlogDetail(slug: string) {
    return this.http.get(`${this.apiUrl2}/api/blogdetail/?slug=${slug}`);
  }
  
  get_Logo() {
    return this.http.get(`${this.apiUrl2}/api/logo/`);
  }

  get_category_products(){
    return this.http.get(`${this.apiUrl2}/api/product_for_home/`);
  }

}
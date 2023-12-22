import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductApiService } from '../services/product-api.service';
@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit {
  showSearch=false;
  search = new FormGroup({
    searchItem:new FormControl
  });

  formfield!: number;
  show!: boolean;
  products:any;
  category:any;
  categoryList:any;
  show_bg!: boolean;
  allProducts:any;

  constructor(private router:Router, private route:ActivatedRoute, private api:ProductApiService) { }

  ngOnInit(): void {

  }

  showSearchItem(){
    this.showSearch=!this.showSearch;
  }

  searchIt(){
    let search=this.search?.get('searchItem')?.value
    if(search?.trim().length>2){
      this.router.navigate(['search/p/'+this.search?.get('searchItem')?.value.trim()]).then(()=>window.location.reload())
    }
  }

  get searchUrl(){
    let search = this.search?.get('searchItem')?.value
    return `search/p/${search?.trim()}`;
  }

  get searchValue(){
    return this.search?.get('searchItem')?.value
  }

  openInput() {
    let x = window.innerWidth
    let y = x - 1000
    this.show_bg=true
    let search=this.search?.get('searchItem')?.value
    if(search?.trim().length>2){
      this.show=true
      this.allProducts=[]
    //   if(!this.categoryList?.length) {
    //     this.api.subcategoryApiCall().subscribe((data:any)=>{
    //     this.categoryList=data
    //     this.category=this.categoryList?.filter((value:any)=>value?.title.trim().includes(search?.trim()))
    //   })
    // } else {
      this.category=this.categoryList?.filter((value:any)=>value?.title.trim().includes(search?.trim()))
      this.api.getSearchList(search.trim()).subscribe((data:any)=>{
        this.allProducts = data;
        this.products = data.slice(0, 4);
        console.log(data,'search');
        
      }) //} 
    } else {
      this.show=false  
    }
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

  variation(value: any) {
    return value.variations
  }

  getDiscount(value:any){
    if(value?.discount_percentage !== null){
      return Math.ceil(value?.get_discount) + '%' + '+' + Math.ceil(value?.discount_percentage);
    }
    return Math.ceil(value?.get_discount);
  }
  
  // discount(value:any){
  //   let a,b,c
  //   let s = value.variations
  //   let x = (s.mrp - s.price)/s.mrp * 100
  //   let y = (s.price -s.discount_price)/s.price *100
  //   x = +x.toFixed(0)
  //   y = +y.toFixed(0)
  //   a =x?x:""
  //   b =y?y:""
  //   if(x && y ) c = a +"% + "+ b+ "% OFF"
  //   else if(x || y) c = +a + +b +"% OFF"
  //   return c
  // }

  clear(){
    this.show_bg=false
    this.show = false;
    let x=window.innerWidth
    let y= x -1000
    this.search?.get("searchItem")?.setValue("")
  }
  @HostListener('document:click') onDocumentClick() {
    this.clear()
  }
}

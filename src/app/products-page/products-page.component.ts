import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductApiService } from '../services/product-api.service';
import { ProductsDataService } from '../services/product-data.service';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs/operators';
import { WishlistService } from '../services/wishlist.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { TokenService } from '../services/token.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsPageComponent implements OnInit {
[x: string]: any;
  wishlist: any[] = [];
  page: number = 1;
  category_id:any;
  category:any;
  brand:any;
  brand_id:any;
  hide_brand:any;
  catparam: any;
  searchparam:any;
  brandparam:any;
  subcatparam:any;
  products:any;
  loader: boolean = false;
  cart:any;
  categories:any;
  subCategories:any;
  allSubCategories:any;
  processors:any = [];
  allProcessors:any = [];
  operatingsystems:any = [];
  allOperatingSystems:any = [];
  screenSizes:any = [];
  allScreenSizes:any = [];
  storages:any = [];
  allStorages:any = [];
  webcam:any;
  touchScreen:any;
  rams:any = [];
  allRams:any = [];
  brands:any;
  allBrands:any;
  allProducts:any;
  filteredProducts:any;
  totalItems:any;
  selectedSortOption: string | undefined;
  pageSize = 12;
  pageSizeOptions = [5, 10, 25, 100];
  pageIndex = 0;
  discountCurrent:any = [];
  discountList = [  { name: '0% - 10%', value: [0, 10] },
    { name: '10% - 20%', value: [10, 20] },
    { name: '20% - 30%', value: [20, 30] }
  ];
  allDiscounts = [  { name: '0% - 10%', value: [0, 10] },
  { name: '10% - 20%', value: [10, 20] },
  { name: '20% - 30%', value: [20, 30] }
];
  brandsCurrent:any = [];
  subCategoriesCurrent:any = [];
  operatingsystemsCurrent:any = [];
  screenSizesCurrent:any = [];
  storagesCurrent:any = [];
  ramsCurrent:any = [];
  processorsCurrent:any = [];
  error:any;
  account:any;
  
  options: AnimationOptions = {
    path: '/assets/searchanimation.json',
  };

  

  constructor(private cdr: ChangeDetectorRef, private wishlistService: WishlistService, private route: ActivatedRoute, private api: ProductApiService, private productservice: ProductsDataService, private toastr: ToastrService, private Token: TokenService, private login: LoginService) { }

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
    this.selectedSortOption = 'priceAscending'
    this.catparam = this.route.snapshot.paramMap.get('category');
    this.brandparam = this.route.snapshot.paramMap.get('brand');
    this.subcatparam = this.route.snapshot.paramMap.get('subcat');
    this.searchparam = this.route.snapshot.paramMap.get('searchId');
 
    switch (true) {
      case !!this.catparam:
        // Handle param1 scenario
        this.handleCatParam();
        break;
      case !!this.brandparam: 
        // Handle param2 scenario
        this.handleBrandParam();
        break;
      case !!this.searchparam:
        // Handle param3 scenario
        this.handleSearchParam();
        break;
      default:
        // Handle default scenario
        break;
    }
    

    this.productservice.newCartItems.subscribe(()=> {
      let cartt:any = localStorage.getItem('cart');
      try{ 
        if(JSON.parse(cartt)) {
           this.cart=JSON.parse(cartt); 
        } else {
           this.cart={} 
          }
        } catch {
          this.toastr.error("Unable to fetch Cart");
          }
    });

    // this.productservice.itemQuantitySubject.subscribe(()=> {
    //   let cartt:any = localStorage.getItem('cart');
    //   try{ 
    //     if(JSON.parse(cartt)) this.cart=JSON.parse(cartt); 
    //     else this.cart={} 
    //   } catch{
    //     this.cart={}
    //   }
    //   });
    }

    animationCreated(animationItem: AnimationItem): void {
      console.log(animationItem);
    }  


  setOperating_System(data:any){
    this.operatingsystems = data.reduce((accumulator:any, currentValue:any) => {
      if((!(accumulator.includes(currentValue.operating_system?.title)) && currentValue.operating_system !== null)){
        accumulator.push(currentValue.operating_system?.title);
      }
      return accumulator;
    }, []);
    this.allOperatingSystems = this.operatingsystems;
  } 
  
  updateOperatingSystem(opsys:any){
    if (this.operatingsystemsCurrent.includes(opsys)) {
      this.operatingsystemsCurrent = this.operatingsystemsCurrent.filter((i:any) => i !== opsys);
    } else {
      this.operatingsystemsCurrent.push(opsys);
    }
    this.filterandsort();
    // this.filterProducts();
    // this.newSubCategories()
  }

  updateWebCam(){
    this.filterandsort();
  } 
  
  updateTouchScreen(){
    this.filterandsort();
  }

    setRams(data:any){
      this.rams = data.reduce((accumulator:any, currentValue:any) => {
        if(!(accumulator.includes(currentValue.RAM?.title))){
          accumulator.push(currentValue.RAM?.title);
        }
        return accumulator;
      }, []);
      this.allRams = this.rams;
    } 
    
    updateRams(ram:any){
      if (this.ramsCurrent.includes(ram)) {
        this.ramsCurrent = this.ramsCurrent.filter((i:any) => i !== ram);
      } else {
        this.ramsCurrent.push(ram);
      }
      this.filterandsort();
      // this.filterProducts();
      // this.newSubCategories()
      }

    setScreenSize(data:any){
      this.screenSizes = data.reduce((accumulator:any, currentValue:any) => {
        if(!(accumulator.includes(currentValue.screen_size?.title))){
          accumulator.push(currentValue.screen_size?.title);
        }
        return accumulator;
      }, []);
      this.allScreenSizes = this.screenSizes;
    } 
    
    updateScreenSizes(ss:any){
      if (this.screenSizesCurrent.includes(ss)) {
        this.screenSizesCurrent = this.screenSizesCurrent.filter((i:any) => i !== ss);
      } else {
        this.screenSizesCurrent.push(ss);
      }
      this.filterandsort(); 
      // this.filterProducts();
      // this.newSubCategories()
      }

    setStorage(data:any){
      this.storages = data.reduce((accumulator:any, currentValue:any) => {
        if(!(accumulator.includes(currentValue.storage?.title))){
          accumulator.push(currentValue.storage?.title);
        }
        return accumulator;
      }, []);
      this.allStorages = this.storages;
    } 
    
    updateStorage(storage:any){
      if (this.storagesCurrent.includes(storage)) {
        this.storagesCurrent = this.storagesCurrent.filter((i:any) => i !== storage);
      } else {
        this.storagesCurrent.push(storage);
      }
      this.filterandsort();
      // this.filterProducts();
      // this.newSubCategories()
      }

    setProcessor(data:any){
      this.processors = data.reduce((accumulator:any, currentValue:any) => {
        if(!(accumulator.includes(currentValue.processor?.title))){
          accumulator.push(currentValue.processor?.title);
        }
        return accumulator;
      }, []);
      this.allProcessors = this.processors;
    } 
    
    updateProcessor(pro:any){
      if (this.processorsCurrent.includes(pro)) {
        this.processorsCurrent = this.processorsCurrent.filter((i:any) => i !== pro);
      } else {
        this.processorsCurrent.push(pro);
      }
      this.filterandsort();
      // this.filterProducts();
      // this.newSubCategories()
      }

  setFilters(data:any){
    this.setProcessor(data);
    this.setOperating_System(data);
    this.setStorage(data);
    this.setScreenSize(data);
    this.setRams(data);

  }  

  handleCatParam() {
    this.loadWishlist();
    this.loader = true;
    this.category_id_title(this.catparam);
    this.api.getCategoryList(this.category_id).pipe(delay(2000)).subscribe({
      next: (data:any) => {
      this.allProducts = data;
      this.filteredProducts = this.allProducts.filter((item:any) => item.variations !== null);
      this.totalItems = this.allProducts.length;
      this.brands = data.reduce((accumulator:any, currentValue:any) => {
        if(!(accumulator.includes(currentValue.brand?.title))){
          accumulator.push(currentValue.brand?.title);
        }
        return accumulator;
      }, []);
      this.allBrands = this.brands;
  
      this.subCategories = [...data.reduce((uniqueSet:any, current:any) => {
        uniqueSet.add(JSON.stringify(current.subcategory));
        return uniqueSet;
      }, new Set())].map(subcategory => JSON.parse(subcategory));
      
      this.allSubCategories = this.subCategories;

      this.setFilters(data);

      this.sortProducts();
      this.loader = false;

    },
    error: (error) => {
      console.log(error, 'error');
      this.error = true;
      this.loader = false;

    },
    complete: () => {
      this.loader = false;
    }
  })

    // this.api.categoryApiCall().subscribe(dataa=>{
    //   this.categories = dataa
    //   this.categories = this.categories.filter((cat:any) => cat.id == this.category_id)
    //   this.subCategories = this.categories[0].subcategories;
    //   this.allSubCategories = this.subCategories
    //   console.log(this.subCategories, 'subcategories');
    //   this.sortProducts()
    // })
  }

  handleSearchParam() {
    this.loader = true;
    this.loadWishlist();
    this.api.getSearchList(this.searchparam).pipe(delay(2000)).subscribe({
      next: (data:any) => {
      this.allProducts = data;
      this.filteredProducts = this.allProducts.filter((item:any) => item.variations !== null);
      this.totalItems = this.allProducts.length;
      this.brands = data.reduce((accumulator:any, currentValue:any) => {
        if(!(accumulator.includes(currentValue.brand?.title))){
          accumulator.push(currentValue.brand?.title);
        }
        return accumulator;
      }, []);
      this.allBrands = this.brands;
      this.subCategories = [...data.reduce((uniqueSet:any, current:any) => {
        uniqueSet.add(JSON.stringify(current.subcategory));
        return uniqueSet;
      }, new Set())].map(subcategory => JSON.parse(subcategory));
      
      this.allSubCategories = this.subCategories;
      this.setFilters(data);
      this.sortProducts();
      this.loader = false;

    },
    error: (error) => {
      console.log(error, 'error');
      this.error = true;
      this.loader = false;

    },
    complete: () => {
      this.loader = false;
    }
  })

    // this.api.categoryApiCall().subscribe(dataa=>{
    //   this.categories = dataa
    //   this.categories = this.categories.filter((cat:any) => cat.id == this.category_id)
    //   this.subCategories = this.categories[0].subcategories;
    //   this.allSubCategories = this.subCategories
    //   console.log(this.subCategories, 'subcategories');
    //   this.sortProducts()
    // })
  }

  handleBrandParam() {
    this.loader = true;
    this.hide_brand = true;
    this.loadWishlist();

    this.brand_id_title(this.brandparam);
    this.api.getBrandList(this.brand_id).pipe(delay(2000)).subscribe({
      next: (data:any) => {
      console.log(data, 'brands');
      this.allProducts = data;
      this.filteredProducts = this.allProducts.filter((item:any) => item.variations !== null);
      this.totalItems = this.allProducts.length;
      
      this.subCategories = [...data.reduce((uniqueSet:any, current:any) => {
        uniqueSet.add(JSON.stringify(current.subcategory));
        return uniqueSet;
      }, new Set())].map(subcategory => JSON.parse(subcategory));
      
      this.allSubCategories = this.subCategories;
      console.log(this.allSubCategories, 'subcats');
      this.setFilters(data);
      this.sortProducts();
      this.loader = false
    },
    error: (error) => {
      console.log(error, 'error');
      this.error = true;
      this.loader = false
    },
    complete: () => {
      this.loader = false;
        }
      })
    }    

  category_id_title(value:any){
    let list
    if(value){ list=value.split(":")
    this.category_id=list[0]
    this.category=list[1]
    //this.titleService.setTitle("Click 4 Needs | "+this.category);
  }
  }

  brand_id_title(value:any){
    let list
    if(value){ 
    list=value.split(":")
    this.brand_id = list[0]
    this.brand = list[1]
    //this.titleService.setTitle("Click 4 Needs | "+this.brand);
  }else{
    this.hide_brand=true
  }
  }

  truncate(str:any) {
    let len = 20;
    if(str.length <= len){
      return str;
    } 
    return str.slice(0, len) + '...'
 };

 variation(value:any){
  return value.variations
}

truncateCat(str:any) {
  let len = 15;
  if(str.length <= len){
    return str;
  } 
  return str.slice(0, len) + '...'
};


sortProducts() {
  switch (this.selectedSortOption) {
    case 'priceAscending':
      this.filteredProducts.sort((a:any, b:any) => +a.variations.price - +b.variations.price);
      break;
    case 'priceDescending':
      this.filteredProducts.sort((a:any, b:any) => +b.variations.price - +a.variations.price);
      break;
    case 'nameAscending':
      this.filteredProducts.sort((a:any, b:any) => (a.title < b.title ? -1 : 1));
      break;
    case 'nameDescending':
      this.filteredProducts.sort((a:any, b:any) => (a.title > b.title ? -1 : 1));
      break;
  }
}

get startIndex() {
  return this.pageIndex * this.pageSize;
}

get endIndex() {
  return this.startIndex + this.pageSize;
}

filterProducts(){
  if((this.brandsCurrent.length === 0 && this.subCategoriesCurrent.length === 0 && this.operatingsystemsCurrent.length === 0 && this.storagesCurrent.length === 0 && this.screenSizesCurrent.length === 0 && this.ramsCurrent.length === 0 && this.processorsCurrent.length === 0 && !this.webcam && !this.touchScreen)){
  this.filteredProducts = this.allProducts;
  this.brands = this.allBrands;
  this.subCategories = this.allSubCategories;
  this.discountList = this.allDiscounts;
  this.operatingsystems = this.allOperatingSystems;
  this.screenSizes = this.allScreenSizes;
  this.rams = this.allRams;
  this.processors = this.allProcessors;
  this.storages = this.allStorages
  return
}
this.filteredProducts = this.allProducts.filter((item:any) => item.variations !== null).filter((product:any) => {
  let matchesBrand = true;
  let matchesOP = true;
  let matchesSt = true;
  let matchesSS = true;
  let matchesRAM = true;
  let matchesWebCam = true;
  let matchesTouchScreen = true;
  let matchesProcessor = true;
  let matchesSubcategory = true;
  let matchesDiscount = true;
  if (this.brandsCurrent && this.brandsCurrent.length > 0) {
    matchesBrand = this.brandsCurrent.includes(product.brand?.title);
  }
  if (this.operatingsystemsCurrent && this.operatingsystemsCurrent.length > 0) {
    matchesOP = this.operatingsystemsCurrent.includes(product.operating_system?.title);
  }
  if(this.webcam){
    if(product.webcam.toLowerCase() == "yes"){
      matchesWebCam = true;
    } else {
      matchesWebCam = false;
    }
  }
  if(this.touchScreen){
    if(product.touch_screen.toLowerCase() == "yes"){
      matchesTouchScreen = true;
    } else {
      matchesTouchScreen = false;
    }
  }
  if (this.screenSizesCurrent && this.screenSizesCurrent.length > 0) {
    matchesSS = this.screenSizesCurrent.includes(product.screen_size?.title);
  }
  if (this.storagesCurrent && this.storagesCurrent.length > 0) {
    matchesSt = this.storagesCurrent.includes(product.storage?.title);
  }
  if (this.ramsCurrent && this.ramsCurrent.length > 0) {
    matchesRAM = this.ramsCurrent.includes(product.RAM?.title);
  }
  if (this.processorsCurrent && this.processorsCurrent.length > 0) {
    matchesProcessor = this.processorsCurrent.includes(product.processor?.title);
  }
  if (this.subCategoriesCurrent && this.subCategoriesCurrent.length > 0) {
    if(product.subcategory !== null){
      matchesSubcategory = this.subCategoriesCurrent.includes(product.subcategory?.title);
    } else {
      matchesSubcategory = true
    }
  }
  // if (this.discountCurrent && this.discountCurrent.length > 0) {
  //   matchesDiscount = this.discountCheck(this.getDiscountPercentage(product.variations.mrp, product.variations.discount_price));
  // }
   return matchesBrand && matchesSubcategory && matchesProcessor && matchesOP && matchesSt && matchesSS && matchesRAM && matchesWebCam && matchesTouchScreen;
});

}

filterandsort() {
  this.page = 1; // Reset the pagination to the first page
  this.filterProducts();
  this.sortProducts();
  console.log('products', this.filteredProducts)
}

updateBrand(brand:any){
if (this.brandsCurrent.includes(brand)) {
  this.brandsCurrent = this.brandsCurrent.filter((i:any) => i !== brand);
} else {
  this.brandsCurrent.push(brand);
}
this.filterandsort();
// this.filterProducts();
// this.newSubCategories()
}

updateSubcategory(subcat:any){
if (this.subCategoriesCurrent.includes(subcat)) {
  this.subCategoriesCurrent = this.subCategoriesCurrent.filter((i:any) => i !== subcat);
} else {
  this.subCategoriesCurrent.push(subcat);
}
this.filterandsort();
//this.filterProducts();
//this.newBrands();
}

updateDiscount(discount:any){
if (this.discountCurrent.some((disc:any) => disc.name == discount.name)) {
  this.discountCurrent = this.discountCurrent.filter((i:any) => i.name !== discount.name);
} else {
  this.discountCurrent.push(discount);
}
this.filterProducts();
}

discountIncludes(discount:any){
return this.discountCurrent.some((disc:any) => disc.name == discount.name)
}

discountCheck(discount:any){
let withinRange = false;
    this.discountCurrent.forEach((range:any) => {
      if (discount >= range.value[0] && discount < range.value[1]) {
        withinRange = true;
      }
    });
    console.log('within', withinRange, 'dis', discount);
    return withinRange;
}

getDiscountPercentage(actualPrice:any, discountedPrice:any) {
return ((actualPrice - discountedPrice) / actualPrice) * 100;
}

newBrands() {
  console.log('before', this.brands)
this.brands = [];
this.brands = this.filteredProducts.reduce((accumulator:any, currentValue:any) => {
  if(!(accumulator.includes(currentValue.brand.title))){
    console.log('curr', currentValue);
    accumulator.push(currentValue.brand.title);
  }
  return accumulator;
}, []);
console.log('after', this.brands)
}

newSubCategories(){
this.subCategories = [];
this.subCategories = this.filteredProducts.reduce((accumulator:any, currentValue:any) => {
  if(currentValue.subcategory !== null){
    if(!(accumulator.includes(currentValue.subcategory.title))){
      accumulator.push(currentValue.subcategory.title);
    }
  }
  return accumulator;
}, []);
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

addproduct(product:any,variation:any){
  if(variation.stock_left>0){
  this.productservice.addToCartTwo(product,variation, 1);
  let cartt:any = localStorage.getItem('cart');
  try{ 
    if(JSON.parse(cartt)) {
       this.cart=JSON.parse(cartt); 
       this.toastr.success("Product Added To Cart");
    } else {
       this.cart={} 
      }
    } catch{
      this.cart={}
    }
  }
}

loadWishlist() {
  
  this.wishlistService.getWishlist().subscribe({
    next: (response) => {
      this.wishlist = response;
      console.log('called', response);
    },
    error: (error) => {
      console.error('Failed to get wishlist:', error);
      // this.toastr.error("failed to load wishlist.")
    }
  });
}


addToWishlist(product: any) {
  this.wishlistService.addToWishlist(product).subscribe({
    next: (data) => {
      this.loadWishlist(); 
      this.cdr.detectChanges(); // Trigger change detection manually
      console.log('added');
      this.toastr.success("Added to wishlist.");
    },
    error: (error) => {
      console.error('Failed to add to wishlist:', error);
      this.toastr.error("Failed to add to wishlist.");
    }
});
}

removeFromWishlist(productId: string) {
  this.wishlistService.removeFromWishlist(productId).subscribe({
    next: () => {
      this.loadWishlist();
      this.cdr.detectChanges(); // Trigger change detection manually
      console.log('removed');
      this.toastr.success("Removed from wishlist.");
    },
    error: (error) => {
      this.toastr.error("Failed to remove from wishlist");
      console.error('Failed to remove from wishlist:', error);
    }
});
}

isInWishlist(productId: string): boolean {
  return this.wishlist.some((item) => item.product_id.id === productId);
}

getDiscount(value:any){
    if(value.discount_percentage !== null){
      return Math.ceil(value.get_discount) + '%' + '+' + Math.ceil(value.discount_percentage);
    }
    return Math.ceil(value.get_discount);
  }

}

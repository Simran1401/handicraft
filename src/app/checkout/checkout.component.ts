import { Component, OnInit } from '@angular/core';
import { ProductsDataService } from '../services/product-data.service';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { ProductApiService } from '../services/product-api.service';
import { ToastrService } from 'ngx-toastr';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  signin = new FormGroup({
    contact: new FormControl(),
    otp1:new FormControl(),
    otp2:new FormControl(),
    otp3:new FormControl(),
    otp4:new FormControl(),
    otp5:new FormControl(),
    otp6:new FormControl()
  });
  next: boolean = true;
  contactInput: boolean = false;
  submit:boolean = true;
  timer!: number;
  err:boolean = false;
  first!: boolean;
  second!: boolean;
  pincodes:any;
  addNewAddress:boolean=true;
  address:any;
  delivery!: FormGroup;
  pincode: any;
  areas: any;
  city: any;
  state: any;
  processing: boolean = false;
  edit: boolean = false;
  addressId: any;
  error_component: boolean = false;
  totalCount!:number;
  subTotal!:number;
  totalMrp:any;
  cart:any;
  removed:any;
  shippingAddress: any;
  billingAddress: any;
  selectedShipping:any;
  selectedBilling:any;
  billingComplete:any = false;
  shippingComplete:any = false;
  sameShipping:any = false;
  payment_methods: any;
  payment_type: any;
  checkoutDone:any;
  payment_processing:any;
  currentStep:any = 1;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  selectedCountry: string | undefined;
  selectedState: string | undefined;
  selectedCity: string | undefined;
  loader: boolean = false;

  options: AnimationOptions = {
    path: '/assets/successAnimation.json',
  };
  contact: any;
  loading: boolean = false;

  constructor(private http: HttpClient, private router:Router,private login:LoginService,private Token:TokenService,private auth:LoginService,private _formBuilder: FormBuilder,private api:ProductApiService,private cart$:ProductsDataService, private toastr: ToastrService) {}


  ngOnInit(): void {
    this.loader = true;
    this.fetchCountries();

    this.checkoutDone = false;
    this.payment_processing = false;
    // this.api.subcategoryApiCall().subscribe(data => {
    //   console.log('subcats', data);
    // })
    // this.api.getSearchList('lap').subscribe(data => {
    //   console.log('search', data);
    // })
    this.cart$.newCartItems.subscribe(()=>{
      let removed_productss:any = localStorage.getItem('removed_products');
      try{
        let cartitem:any = localStorage.getItem('cart');
        this.cart=Object.values(JSON.parse(cartitem)); 
        let subTotal=0; 
        let totalMrp=0; 
        let totalCount=0; 
        this.cart.map((value:any)=>{
          subTotal = subTotal + value["details"]["variation"]["discount_price"] * value["count"]; 
          totalCount=totalCount + value["count"] + (value["count"] * (value?.details?.variation?.addon_product?1:0)); 
          totalMrp = totalMrp + value["details"]["variation"]["mrp"] * value["count"]}); 
          this.totalMrp = +totalMrp.toFixed(2); 
          this.subTotal = +subTotal.toFixed(2); 
          this.totalCount = totalCount
        } catch{}
      
        try{
          this.removed = Object.values(JSON.parse(removed_productss))
        } catch {} 
        console.log('cart', this.cart);
    })

    this.contactInput = true;
    this.next = true;
    this.submit=true;

    this.authCheck();

    this.delivery=this._formBuilder.group({
      name:['',Validators.required],
      contact:['',[Validators.required, Validators.pattern('^[0-9]{10}')]],
      postcode:[''],
      address:['',Validators.required],
      locality:['', Validators.required],
      // landmark:new FormControl(),
      city:new FormControl(),
      state:new FormControl(),
      country:new FormControl(),
      gst: ''
      // area:['', Validators.required]    
    })

    // this.setShippingAddress();
    // this.setBillingAddress();
    this.paymentMethods();
    //this.getAddress()
    
    // this.first = true;
  }

  authCheck(){
     
    if(localStorage.getItem('cart')){
      let cartitem:any = localStorage.getItem('cart');
        this.cart=Object.values(JSON.parse(cartitem));
      if(this.cart?.length <= 0){
        this.router.navigate(['/']);
      } else {
        if(this.Token.getHeaders()) {
          this.auth.clientCredentials()?.pipe(delay(2000)).subscribe({
            next: (value:any) => {
              if(value["username"]) {
                this.contact = value["username"]
              }
    
              if(value['id']){ 
                this.first=true;
                this.currentStep = 2;
                this.setShippingAddress();
                this.setBillingAddress();
                //this.second=true;
                // setTimeout(() => {
                //   this.myStepper.next();
                //   this.getAddress();}, 0);
                } 
            },
            error: (err) => {
              console.log('error in auth', err)
            },
            complete: () => {
              this.loader = false
            }
          })
        } else {
          setTimeout(() => {
            this.loader = false;
          }, 2000);
        }
      }
    } else {
      this.router.navigate(['/']);
    }
    
    
  }

  enterNumber = true;
  enterOtp = false;
  showAddress=true;
  showForm=false;

  openNumber() {
    this.enterNumber = true;
    this.enterOtp = false;
  }

  handleSameShipping() {
    console.log('Checkbox state changed:', this.sameShipping);
    // Perform any additional actions based on the checkbox state change
  }

  setSelectedBilling(address:any){
    this.selectedBilling = address[0].id;
  }

  setSelectedShipping(address:any){
    this.selectedShipping = address[0].id
  }

  openOtp() {
    this.enterNumber = false;
    this.enterOtp = true;
    
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }  

  // openAddAddressForm(){
  //   this.showForm=true;
  //   this.showAddress=false
  // }

  openAddAddressForm(){
    this.delivery.reset()
    this.showForm=true;
    this.edit = false;
    this.showAddress=false
  }

  openAddresses(){
    this.showForm=false;
    this.showAddress=true
  }

  validate(){
    let x=this.signin?.get('contact')?.value
    if(x && x.match(/^\d{10}$/)) {
      this.next=false; 
    }  else {
      this.next=true;
    }
  }

  otplength(n:any){
    let otp = this.otp(1) + this.otp(2) + this.otp(3) + this.otp(4) + this.otp(5) + this.otp(6)
    let y = this.signin.get('otp'+n);
    if(y?.value && y?.value.length>0) try{ 
      document?.getElementById('otp'+(n+1))?.focus()
     }catch{}
    if(otp.length==6) this.submit=false;
    else this.submit=true;
  }

  selectShipping(id:any){
    this.selectedShipping = id;
  }

  selectBilling(id:any){
    this.selectedBilling = id;
  }

  changeBilling(){
    this.currentStep = 2;
    this.billingComplete = false;
    this.shippingComplete = false;
  }

  changeShipping(){
    this.currentStep = 3;
    this.shippingComplete = false;
  }

  billingShow(){
    if(this.billingAddress?.length > 0 && this.selectedBilling && this.currentStep == 2){
      return true;
    } else {
      return false;
    }
  }

  shippingShow(){
    if((this.shippingAddress?.length > 0 && this.selectedShipping && this.currentStep == 3) || (this.sameShipping && this.currentStep == 3)){
      return true;
    } else {
      return false;
    }
  }

  continueBilling(){
    if(this.billingAddress?.length > 0 && this.selectedBilling){
      this.billingComplete = true;
      this.currentStep = 3;
    }
  }

  continueShipping(){
    if(this.sameShipping){
      this.sameShippingAddressPost();
    } else {
      if(this.shippingAddress?.length > 0 && this.selectedShipping){
        this.shippingComplete = true;
        this.currentStep = 4
      }
    }
  }

  sameShippingAddressPost() {
    let currentBillingDetails = this.billingAddress.filter((add:any) => add.id == this.selectedBilling);
    let formData = new FormData();
    formData.append('address_type', 'Shipping');
    formData.append('full_name', currentBillingDetails[0].full_name);
    formData.append('mobile', currentBillingDetails[0].mobile);
    formData.append('address', currentBillingDetails[0].address);
    formData.append('locality', currentBillingDetails[0].locality);
    formData.append('country', currentBillingDetails[0].country);
    formData.append('state', currentBillingDetails[0].state);
    formData.append('city', currentBillingDetails[0].city);
    formData.append('pincode', currentBillingDetails[0].pincode);
        this.api.add_addressOJ(formData).subscribe({
          next: (data:any) => {
            this.processing=false;
              console.log(data, 'address')
              this.sameShipping = false;
              //this.toastr.success("Shipping Address Created Successfully!");
              this.setShippingAddress();
              this.shippingComplete = true;
              this.currentStep = 4;
          },
          error: (err) => {
            console.log('err', err);
            this.toastr.error("Error While Same Billing Address");
          },
        })
  }


  deleteOtp(n:any){
    let y = this.signin.get('otp'+n);
    if(!y?.value) try{ document?.getElementById('otp'+(n-1))?.focus() }catch{}
  }


  change(){
    this.signin.reset()
    //this.timer=0
    this.next=true
    this.contactInput=true
    //setTimeout(()=>document.getElementById('contact').focus(),0)
    this.openNumber();
  }

  get contact_number(){
    return this.signin?.get('contact')?.value
  }

  otp(n:any){
    return this.signin?.get('otp'+n)?.value
  }

  submitIt(){
    let server;
    let otp=this.otp(1)+this.otp(2)+this.otp(3)+this.otp(4)+this.otp(5)+this.otp(6)
    let contact=this.signin?.get('contact')?.value;
    this.login.loginRequestOtp(contact,otp).subscribe({
      next: (res:any) => {
        server=res;
        if(server.key){ 
          this.Token.setToken(server.key,contact); 
          this.toastr.success("Login Successfull");
          this.first=true; 
          this.currentStep = 2;
          // setTimeout(() => { 
          //   //this.myStepper.next(); 
          //   //this.getAddress()}, 0) 
          // })
          this.setShippingAddress();
          this.setBillingAddress();
          setTimeout(() => {window.location.reload() }, 1000); 
        }
        if(server.error){
          this.err=true;
          this.toastr.error("Error",server.error);
          // this.toastr.error("Server Error");
          //this.displayError(server.error);
        }
      },
      error: (err) => {
        this.toastr.error("Unable to verify OTP");
        //this.displayError("Unable to verify OTP")
      }
    })
  }


  nextBlock(){
    let contact=this.signin?.get('contact')?.value
    let server;
    
    // if(contact && contact.match(/^\d{10}$/)){
    // this.openOtp();
    // }
    if(contact.match(/^\d{10}$/)){
      this.login.loginRequest(contact).subscribe({
        next: (res:any) => {
        // console.log('work2', res);
         server=res;
        if(server.otp_sent===true){
          //this.displaySuccess("Otp sent successfully!"); 
          this.toastr.success("Otp sent successfully");
          this.contactInput=false;
          this.timer=30;
          this.timer$();
          setTimeout(()=>{
            this.openOtp();
            document?.getElementById('otp1')?.focus()
          },0) 
        }
      },
      error: (err) => { 
          console.log('error in nextblock', err)
          this.toastr.error("Unable to send OTP");
      }
    })
    }
  }

  timer$(){
    if(this.timer>0){ 
      this.timer=this.timer-1; 
      setTimeout(() => { this.timer$() }, 1000);
    }
  }

  onSubmitBilling(){
    

    if(this.delivery.valid){
      if(!this.edit){
        let formData = new FormData();
    formData.append('address_type', 'Billing');
    formData.append('full_name', this.delivery?.get('name')?.value);
    formData.append('mobile', this.delivery?.get('contact')?.value);
    formData.append('address', this.delivery?.get('address')?.value);
    formData.append('locality', this.delivery?.get('locality')?.value);
    formData.append('country', this.delivery?.get('country')?.value);
    formData.append('state', this.delivery?.get('state')?.value);
    formData.append('city', this.delivery?.get('city')?.value);
    formData.append('pincode', this.delivery?.get('postcode')?.value);
    formData.append('gst_no', this.delivery?.get('gst')?.value);
    this.api.add_addressOJ(formData).subscribe({
      next: (data:any) => {
        this.processing=false;
          console.log(data, 'address')
          this.toastr.success("Billing Address Added Successfully!");
          this.setBillingAddress();
          this.closeAddress();
      },
      error: (err) => {
        console.log('err', err);
        this.toastr.error("Error while adding billing address");
      },
    })
      } else {
        let formData = new FormData();
    formData.append('address_type', 'Billing');
    formData.append('full_name', this.delivery?.get('name')?.value);
    formData.append('mobile', this.delivery?.get('contact')?.value);
    formData.append('address', this.delivery?.get('address')?.value);
    formData.append('locality', this.delivery?.get('locality')?.value);
    formData.append('country', this.delivery?.get('country')?.value);
    formData.append('state', this.delivery?.get('state')?.value);
    formData.append('city', this.delivery?.get('city')?.value);
    formData.append('pincode', this.delivery?.get('postcode')?.value);
    formData.append('gst_no', this.delivery?.get('gst')?.value);

        this.api.putAddress2(formData, this.addressId).subscribe({
          next: (data:any) => {
            this.processing=false;
              console.log(data, 'address')
              this.toastr.success("Billing Address Updated Successfully!");
              this.setBillingAddress();
              this.closeAddress();
          },
          error: (err) => {
            console.log('err', err);
            this.toastr.error("Error while updating billing address");
          },
        })
      }
    } else {
      Object.keys(this.delivery.controls).forEach(field => {
        const control = this.delivery.get(field);
        if (control && control.invalid) {
          this.toastr.error(`Please enter a valid ${field}`, 'Error');
        }
      });
  }
  }

  onSubmitShipping(){
    

    if(this.delivery.valid){
      if(!this.edit){
        let formData = new FormData();
    formData.append('address_type', 'Shipping');
    formData.append('full_name', this.delivery?.get('name')?.value);
    formData.append('mobile', this.delivery?.get('contact')?.value);
    formData.append('address', this.delivery?.get('address')?.value);
    formData.append('locality', this.delivery?.get('locality')?.value);
    formData.append('country', this.delivery?.get('country')?.value);
    formData.append('state', this.delivery?.get('state')?.value);
    formData.append('city', this.delivery?.get('city')?.value);
    formData.append('pincode', this.delivery?.get('postcode')?.value);
    this.api.add_addressOJ(formData).subscribe({
      next: (data:any) => {
        this.processing=false;
          console.log(data, 'address')
          this.toastr.success("Shipping Address Added Successfully!");
          this.setShippingAddress();
          this.closeAddress();
      },
      error: (err) => {
        console.log('err', err);
        this.toastr.error("Error while adding shipping address");
      },
    })
      } else {
        let formData = new FormData();
    formData.append('address_type', 'Shipping');
    formData.append('full_name', this.delivery?.get('name')?.value);
    formData.append('mobile', this.delivery?.get('contact')?.value);
    formData.append('address', this.delivery?.get('address')?.value);
    formData.append('locality', this.delivery?.get('locality')?.value);
    formData.append('country', this.delivery?.get('country')?.value);
    formData.append('state', this.delivery?.get('state')?.value);
    formData.append('city', this.delivery?.get('city')?.value);
    formData.append('pincode', this.delivery?.get('postcode')?.value);
        this.api.putAddress2(formData, this.addressId).subscribe({
          next: (data:any) => {
            this.processing=false;
              console.log(data, 'address')
              this.toastr.success("Shipping Address Updated Successfully!");
              this.setShippingAddress();
              this.closeAddress();
          },
          error: (err) => {
            console.log('err', err);
            this.toastr.error("Error while updating shipping address");
          },
        })
      }
    } else {
      Object.keys(this.delivery.controls).forEach(field => {
        const control = this.delivery.get(field);
        if (control && control.invalid) {
          this.toastr.error(`Please enter a valid ${field}`, 'Error');
        }
      });
  }
  }



  getAddress(){
    this.addNewAddress=false
    if(this.Token.getHeaders()) {
      this.api.getAddress().subscribe(data=>{
      this.address=data
      console.log('add', data)
      if(!this.address?.length) this.error_component=true
      else this.error_component=false
    })
  }
  }

  setShippingAddress(){
    this.api.getAddress().subscribe((data:any) => {
      this.address = data;
      this.shippingAddress = data.filter((address:any) => address.address_type == 'Shipping');
      this.setSelectedShipping(this.shippingAddress)
    })
  }

  setBillingAddress(){
    this.api.getAddress().subscribe((data:any) => {
      this.address = data;
      this.billingAddress = data.filter((address:any) => address.address_type == 'Billing');
      this.setSelectedBilling(this.billingAddress);
    })
  }

  newAddress(){
    this.edit=false
    this.delivery.reset()
    this.addNewAddress=true
  }

  editAddress2(value:any){
    console.log(value);
    this.delivery?.get("name")?.setValue(value.full_name)
    this.delivery?.get("contact")?.setValue(value.mobile)
    this.delivery?.get("postcode")?.setValue(value.pincode)
    this.delivery?.get("address")?.setValue(value.address)
    this.delivery?.get("locality")?.setValue(value.locality)
    this.delivery?.get("state")?.setValue(value.state)
    this.delivery?.get("country")?.setValue(value.country)
    this.delivery?.get("city")?.setValue(value.city);
    this.delivery?.get("address_type")?.setValue(value.address_type);
    this.delivery?.get("gst")?.setValue(value.gst_no);

    this.addressId=value.id;
    this.openEditAddressForm();    
  }

  editAddress(value:any){
    this.loading = true;
   
    const countryCode = this.countries.find(country => country.name == value.country)?.iso_code;
    this.http.get<any>(`https://countryapi.greatfuturetechnology.com/api/states/${countryCode}`)
        .subscribe(data => {
          this.states = data;
          const stateCode = data.find((state:any) => state.name == value.state)?.iso_code;
          this.http.get<any>(`https://countryapi.greatfuturetechnology.com/api/cities/${countryCode}/${stateCode}`)
        .subscribe(data => {
          this.cities = data;
          //this.addressType = type; 
    
          this.delivery?.get("name")?.setValue(value.full_name)
    this.delivery?.get("contact")?.setValue(value.mobile)
    this.delivery?.get("postcode")?.setValue(value.pincode)
    this.delivery?.get("address")?.setValue(value.address)
    this.delivery?.get("locality")?.setValue(value.locality)
    this.delivery?.get("state")?.setValue(value.state)
    this.delivery?.get("country")?.setValue(value.country)
    this.delivery?.get("city")?.setValue(value.city);
    this.delivery?.get("address_type")?.setValue(value.address_type);
    this.delivery?.get("gst")?.setValue(value.gst_no);

    this.addressId=value.id;

    this.openEditAddressForm();

    this.loading = false;
        })
})
  }

  deleteAddress(id:any){
    this.api.deleteAddress(id).subscribe((res:any)=>{
      this.setBillingAddress();
      this.setShippingAddress();
      this.toastr.success("Address deleted successfully");
      // err=>this.displayError("Please check your network!"))
    })
  }

  updatePrimaryAddress(id:any){
    this.api.updatePrimaryAddress(id).subscribe((res:any)=>{
      this.toastr.success("Default Address Changed");
      this.setBillingAddress();
      this.setShippingAddress();
      // err=>this.displayError("Please check your network!"))
    })
  }

  get deliveryForm(){
    return this.delivery.controls
  }
  count(n:any){
    return new Array(n)
  }
  async get_area(){
    let x = this.delivery?.get("postcode")?.value;
    console.log(x, 'psot')
        this.api.getPincodeDetails(x).subscribe((data:any)=>{
          console.log(data,'pin')
            this.pincode=data["id"]
            this.areas=data["areas"]
            this.city=data["city"]
            this.state=data["state"]
        })     
    }

    openEditAddressForm(){
      this.showForm=true;
      this.edit = true;
      this.showAddress=false
    }
  
    closeAddress(){
      this.showForm = false;
      this.showAddress = true;
    }

    paymentMethods(){
      this.api.getPaymentMethods().subscribe({
        next: (data:any) => {
          this.payment_methods = data;
          this.payment_type = data[0].id;
          console.log(data, 'apyment');
        },
        error: (err) => {
          console.log('Unable to fetch payment methods.', err);
        }
      })
    }

    createOrder(){
      this.payment_processing = true;
      const formData = new FormData();
      let data2 = [];
      let cart:any = this.cart;
      for (let index = 0; index < this.cart.length; index++) {
        const element = this.cart[index];
        data2.push({"product": element.details.id, "product_var": element.details.variation.id, "quantity": element.count})
      }
      formData.append('payment_method', JSON.stringify(this.payment_type));
      formData.append('json', JSON.stringify(data2));
      formData.append('billing_addresse', JSON.stringify(this.selectedBilling));
      formData.append('shipping_address', JSON.stringify(this.selectedShipping));

      console.log(this.selectedBilling, this.selectedShipping, data2, this.payment_type);

      this.api.createOrder(formData).subscribe({
        next: (data:any) => {
          localStorage.removeItem("cart")
          console.log(data, 'order');
          window.open(data?.url, '_self');
          //this.afterCheckout2(data);
        },
        error: (err) => {
          console.log('err order', err);
          this.toastr.error("Error occured while placing order!");
          this.payment_processing=false
        }
      })

    }

    afterCheckout2(data:any){
      //this.router.navigate([data[0]?.url]);

      window.open(data[0]?.url, '_blank');
    }

    afterCheckout(){
      this.checkoutDone=true
      localStorage.removeItem("cart")
      this.payment_processing=false
      setTimeout(() => {
        this.router.navigate(['/myaccount/order-returns'])
        this.checkoutDone=false
      }, 3000);
    }

    orderShow(){
      if(this.currentStep == 4){
        return true;
      } else {
        return false;
      }
    }

    fetchCountries() {
      this.http.get<any>('https://countryapi.greatfuturetechnology.com/api/countries/')
        .subscribe(data => {
          this.countries = data;
        });
    }
  
    onCountryChange(event:any) {
      this.selectedCountry = event.target.value;
      const selectedCountry = event.target.value;
      const countryCode = this.countries.find(country => country.name === selectedCountry)?.iso_code;
      if (countryCode) {
        this.fetchStates(countryCode);
      }
    }
  
    fetchStates(countryCode: string) {
      this.http.get<any>(`https://countryapi.greatfuturetechnology.com/api/states/${countryCode}`)
        .subscribe(data => {
          console.log(data,'states');
          this.states = data;
        });
    }
  
    onStateChange(event:any) {
      this.selectedState = event.target.value;
      const selectedState = event.target.value;
      const stateCode = this.states.find(state => state.name === selectedState)?.iso_code;
      const selectedCountry = this.countries.find(country => country.name === this.delivery?.get('country')?.value)?.iso_code;
      console.log(selectedCountry, stateCode, '...');
      if (stateCode && selectedCountry) {
        this.fetchCities(selectedCountry, stateCode);
      }
    }
  
    onCityChange(event:any) {
      this.selectedCity = event.target.value;    
    }  

    fetchCities(countryCode: string, stateCode: string) {
      console.log(countryCode, stateCode, '...');
      this.http.get<any>(`https://countryapi.greatfuturetechnology.com/api/cities/${countryCode}/${stateCode}`)
        .subscribe(data => {
          console.log('city', data);
          this.cities = data;
        });
    }

}

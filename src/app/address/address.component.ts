import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductApiService } from '../services/product-api.service';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  loading: boolean = false;
  addressId: any;
  edit: boolean = false;
  errorMessage: any;
  error: boolean = false;
  successMessage: any;
  done: boolean = false;
  pincode: any;
  areas: any;
  city: any;
  state: any;
  error_component: boolean = false;
  processing: boolean = false;
  pincodes:any;
  addNewAddress:boolean=true;
  address:any;
  delivery!: FormGroup;
  shippingAddress: any;
  billingAddress: any;
  addressType: any;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  selectedCountry: string | undefined;
  selectedState: string | undefined;
  selectedCity: string | undefined;
  allowGST: boolean = false;
  
  constructor(private http: HttpClient, private api:ProductApiService,private _formBuilder:FormBuilder,private Token:TokenService, private toastr: ToastrService) { }

  ngOnInit(){
    this.loading = true;
    this.fetchCountries();
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
    });
    
    this.setShippingAddress();
    this.setBillingAddress();
    this.getAddress();
  }

  enterNumber = true;
  enterOtp = false;
  showAddress=true;
  showForm=false;

  openNumber() {
    this.enterNumber = true;
    this.enterOtp = false;
  }

  openOtp() {
    this.enterNumber = false;
    this.enterOtp = true;
    
  }

  openAddAddressForm(type:any){
    this.addressType = type;
    if(type == 'Billing'){
      this.allowGST = true;
    } else {
      this.allowGST = false
    }
    this.delivery.reset()
    this.showForm=true;
    this.edit = false;
    this.showAddress=false
  }

  openEditAddressForm(){
    this.showForm=true;
    this.edit = true;
    this.showAddress=false
  }

  openAddresses(){
    this.showForm=false;
    this.showAddress=true
  }

  closeAddress(){
    this.showForm = false;
    this.showAddress = true;
  }

onSubmit(){
  if(this.addressType === 'Billing'){
    console.log('Billing');
    this.onSubmitBilling();
  } else if(this.addressType === 'Shipping'){
    console.log('Shipping');
    this.onSubmitShipping();
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
    error(err) {
      console.log('err', err);
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
        error(err) {
          console.log('err', err);
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
    error(err) {
      console.log('err', err);
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
        error(err) {
          console.log('err', err);
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

//   onSubmit(){
//     if(this.delivery.valid){
//       if(this.edit){
//         this.api.putAddress(this.delivery,this.city,this.state,this.pincode, this.addressId).subscribe((res:any)=>{
//           this.processing=false;
//           console.log(res, 'address')
//           this.toastr.success("Address Updated Successfully!");
//           this.getAddress()
//           this.closeAddress();
//         });
//       } else {
//         this.api.postAddress(this.delivery,this.city,this.state,this.pincode).subscribe((res:any)=>{
//           this.processing=false;
//           console.log(res, 'address')
//           this.toastr.success("Address Saved Successfully!");
//           this.getAddress()
//           this.closeAddress();
//         }
//           // err=>{ this.displayError("Couldn't able to save your address");
//         ); 
//       }
//     } else {
//       Object.keys(this.delivery.controls).forEach(field => {
//         const control = this.delivery.get(field);
//         if (control && control.invalid) {
//           this.toastr.error(`Please enter a valid ${field}`, 'Error');
//         }
//       });
//   }
// }

  getAddress(){
    this.addNewAddress=false
    if(this.Token.getHeaders()) this.api.getAddress().subscribe(data=>{
      this.address=data
      console.log('add', data)
      if(!this.address?.length) this.error_component=true
      else this.error_component=false
    })
  }

  newAddress(){
    this.edit=false
    this.delivery.reset()
    this.addNewAddress=true
  }

  editAddress(value:any, type:any){
    this.loading = true;
    if(type == 'Billing'){
      this.allowGST = true;
    } else {
      this.allowGST = false;
    }
    // this.selectedCountry = value.country;
    // this.selectedState = value.state;
    // this.selectedCity = value.city;
    // this.setStateCity(value.country, value.state);
    const countryCode = this.countries.find(country => country.name == value.country)?.iso_code;
    this.http.get<any>(`https://countryapi.greatfuturetechnology.com/api/states/${countryCode}`)
        .subscribe(data => {
          console.log(data,'states');
          this.states = data;
          const stateCode = data.find((state:any) => state.name == value.state)?.iso_code;
          // this.fetchCities(countryCode, stateCode);
          this.http.get<any>(`https://countryapi.greatfuturetechnology.com/api/cities/${countryCode}/${stateCode}`)
        .subscribe(data => {
          console.log('city', data);
          this.cities = data;
          this.addressType = type; 
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
        });
          
        });

    // },err=>this.displayError("Couldn't able to edit!"))
  }

  setStateCity(country:any, state:any){
    console.log('cc', country, state);
    const selectedCountry = country;
    const selectedState = state;
    const countryCode = this.countries.find(country => country.name == selectedCountry)?.iso_code;
    this.http.get<any>(`https://countryapi.greatfuturetechnology.com/api/states/${countryCode}`)
        .subscribe(data => {
          console.log(data,'states');
          this.states = data;
          const stateCode = data.find((state:any) => state.name == selectedState)?.iso_code;
          this.fetchCities(countryCode, stateCode);
        });
  }

  deleteAddress(id:any, type:any){
    if(type == 'Billing'){
      this.api.deleteAddress(id).subscribe((res:any)=>{
        this.setBillingAddress();
        this.toastr.success("Address deleted successfully");
        // err=>this.displayError("Please check your network!"))
      })
    } else {
      this.api.deleteAddress(id).subscribe((res:any)=>{
        this.setShippingAddress();
        this.toastr.success("Address deleted successfully");
        // err=>this.displayError("Please check your network!"))
      })
    }
    
  }

  updatePrimaryAddress(id:any, type:any){
    if(type == 'Billing'){
      this.api.updatePrimaryAddress(id).subscribe((res:any)=>{
        this.toastr.success("Default Address Changed");
        this.setBillingAddress();
        // err=>this.displayError("Please check your network!"))
      })
    } else {
      this.api.updatePrimaryAddress(id).subscribe((res:any)=>{
        this.toastr.success("Default Address Changed");
        this.setShippingAddress();
        // err=>this.displayError("Please check your network!"))
      })
    }
  }
 
  get deliveryForm(){
    return this.delivery.controls
  }

  count(n:any){
    return new Array(n)
  }


    setShippingAddress(){
      this.api.getAddress().subscribe((data:any) => {
        this.loading = false;
        this.address = data;
        this.shippingAddress = data.filter((address:any) => address.address_type == 'Shipping');
      })
    }
  
    setBillingAddress(){
      this.api.getAddress().subscribe((data:any) => {
        this.address = data;
        this.billingAddress = data.filter((address:any) => address.address_type == 'Billing');
      })
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

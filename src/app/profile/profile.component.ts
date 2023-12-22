import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { TokenService } from '../services/token.service';
import { LoginComponent } from '../login/login.component';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  errorMessage: any;
  error: boolean = false;
  successMessage: any;
  done: boolean = false;
  error_component: boolean = false;
  processing: boolean = false;
  loading:boolean = false;

  constructor(private _formbuilder:FormBuilder,private login:LoginService,private Token:TokenService, private toastr: ToastrService) { }
  profile!: FormGroup
  details:any;
  userId!: number;
  ngOnInit(): void {
    this.loading = true;
    this.profile = this._formbuilder.group({
      first_name: ['', [Validators.required, this.firstNameValidator]],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      mobile: ['', Validators.required]
    });
    // this.profile=this._formbuilder.group({
    //   first_name: new FormControl('', [Validators.required]),
    //   mobile: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(/^[0-9]*$/)]),
    //   email: new FormControl('', [Validators.required, Validators.email]),
    //   dob: new FormControl('', [Validators.required]),
    // })
    if(this.Token.getHeaders()) {
      this.login?.clientCredentials()?.pipe(delay(2000)).subscribe((value:any)=>{
        this.details=value;
        try{
          const values=Object.values(this.details)
          if(!values?.length) {
            this.error_component=true 
          } else {
            this.error_component=false;
          }
        }catch{
          this.error_component=true
        }
        this.userId=value["id"];
        this.profile?.get("first_name")?.setValue(value["first_name"]?value["first_name"]:"");
        this.profile?.get("mobile")?.setValue(value["mobile"]?value["mobile"]:"");
        this.profile?.get("email")?.setValue(value["email"]?value["email"]:"");
        this.profile?.get("dob")?.setValue(value["dob"]?value["dob"]:"");
        this.loading = false;
      })
    }
  }

  firstNameValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[A-Za-z]+$/; // Regular expression to allow only alphabets
  
    if (control.value && !pattern.test(control.value)) {
      return { 'firstNameInvalid': true }; // Return an error if the first_name contains non-alphabetic characters
    }
  
    return null; // Return null if the first_name is valid
  }
  
  submit() {
    
    if(this.profile.valid){
      this.login.updateCredentials(this.userId?.toString(),this.profile.value).subscribe(res=>{
        if(res){ 
          this.toastr.success("Your Details updated successfully");
        }
        })
    } else {
      Object.keys(this.profile.controls).forEach(field => {
        const control = this.profile.get(field);
        if (control && control.invalid) {
          this.toastr.error(`Please enter a valid ${field}`, 'Error');
        }
      });
      // this.toastr.error('Please fill in all the required fields', 'Error');
      // if(this.profile.controls['first_name'].errors) {
      //   this.toastr.error("Please enter your name!");
      // }
    }
  }
  // submit(){
  //   if(this.profile.valid){
  //     this.processing=true
  //     this.login.updateCredentials(this.userId,this.profile.value).subscribe(res=>{
  //     if(res){ this.displaySuccess("Your details updated successfully!");this.processing=false ;this.ngOnInit()}
  //     },err=>this.processing=false)
  //   }else{
  //     if(this.profile.controls.first_name.errors) this.displayError("Please enter your name!") 
  //     else if(this.profile.controls.email.errors) this.profile.controls.email.errors.required?this.displayError("Please enter your email address!"):this.displayError("Please enter a valid email address!")
  //     else if(this.profile.controls.mobile.errors) this.profile.controls.mobile.errors.required?this.displayError("Please enter your mobile number!"):this.displayError("Please enter a valid mobile number!")
  //     else if(this.profile.controls.dob.errors) this.displayError("Please enter your DOB!")
  //   }
  // }
  // displayError(err){
  //   this.errorMessage=err
  //   this.error=true
  //   setTimeout(() => this.error=false, 3000);
  // }
  // displaySuccess(msg){
  //   this.successMessage=msg
  //   this.done=true
  //   setTimeout(() => this.done=false, 3000);
  // }
  // openDialog(){
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = false;
  //   dialogConfig.autoFocus = true;
  //   this.dialog.open(LoginComponent,{panelClass: 'logindialog'});
  // }
}

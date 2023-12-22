import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  })
export class LoginComponent implements OnInit {
  successMessage: any;
  done: boolean = false;

  
  constructor(private login:LoginService,private Token:TokenService, private toastr: ToastrService) { }
  next: boolean = false;
  submit: boolean = false;
  contactInput: boolean = false;
  errorMsg:any;
  timer!: number;
  err$: boolean = false;
  login_style!: string;
  ngOnInit(): void { 
    this.next=true;
    this.submit=true;
    this.contactInput=true;
  }
  signin = new FormGroup({
    contact: new FormControl(),
    otp1:new FormControl(),
    otp2:new FormControl(),
    otp3:new FormControl(),
    otp4:new FormControl(),
    otp5:new FormControl(),
    otp6:new FormControl()
});
  
  change(){
    this.signin.reset()
    this.timer=0
    this.errorMsg=""
    this.next=false
    this.contactInput=true
    setTimeout(()=>document?.getElementById('contact')?.focus(),0)
  }
  resend(){
    let contact=this.signin?.get('contact')?.value,server:any;
    if(contact.length>9 && contact.length<11 && contact.match(`^[0-9]*$`)){
      this.login.loginRequest(contact).subscribe(res=>{
        server=res;
        if(server.otp_sent===true){ 
          this.contactInput=false; 
          this.errorMsg=null; 
          this.err$=false; this.timer=30; 
          this.timer$();
        }
      // },err=>{ this.err$=false; this.errorMsg="Unable to send OTP!" }) }
  })
}
  }

  validate(){
    let x=this.signin?.get('contact')?.value
    if(x && x.length>9 && x.length<11 && x.match(`^[0-9]*$`)) this.next=false; 
    else this.next=true;
  }

  submitIt(){
    let server:any;
    let otp=this.otp(1)+this.otp(2)+this.otp(3)+this.otp(4)+this.otp(5)+this.otp(6)
    let contact=this.signin?.get('contact')?.value
    this.login.loginRequestOtp(contact,otp).subscribe(res=>{
        server=res;
        if(server.key){ 
          this.Token.setToken(server.key,contact); 
          this.login_style="display:none;";
          this.displaySuccess("Login Successfully!"); 
          setTimeout(() => {window.location.reload() }, 1000); 
        }
        if(server.error){ this.errorMsg=server.error; this.err$=true;
        }else{this.err$=false;this.errorMsg=null}
      // },err=>{ this.err$=false; this.errorMsg="Unable to verify OTP"})
  })
}

  nextBlock(){
    let contact=this.signin?.get('contact')?.value
    let server:any;
    if(contact.length>9 && contact.length<11 && contact.match(`^[0-9]*$`)){
      this.login.loginRequest(contact).subscribe({
        next: (data:any) =>{
          if(data.error){
            this.toastr.error("An error occurred! Try after sometime");
          }
        server=data;
        if(server.otp_sent===true){ 
          this.contactInput=false; 
          this.errorMsg=null; 
          this.err$=false;this.timer=30;
          this.timer$();
          setTimeout(()=>document?.getElementById('otp1')?.focus(),0) 
        }
      },
      error: (error) => {
        // Handle any errors that occur during subscription.
        console.error('An error occurred during subscription:', error);
        this.toastr.error("An error occurred!");
        // Show an error message to the user
      }})
      // ,err=>{ if(err){ this.err$=false; this.errorMsg="Unable to send OTP!" }
    }
  }

  otplength(n:any){
    let otp = this.otp(1) + this.otp(2) + this.otp(3) + this.otp(4) + this.otp(5) + this.otp(6);
    let y:any = this.signin.get('otp'+n);
    if(y.value && y.value.length>0) {
      try{ document?.getElementById('otp'+(n+1))?.focus() }catch{}
    }
    if(otp.match(`^[0-9]*$`) && otp.length==6) {
      this.submit=false;
        } else{ 
          this.errorMsg=null; this.err$=false; this.submit=true;
         }
  }

  deleteOtp(n:any){
    let y:any = this.signin.get('otp'+n);
    if(!y.value){ 
      try{ 
        document?.getElementById('otp'+(n-1))?.focus() 
      }
      catch{}; 
    this.err$=false; 
  }
  }

  otp(n:any){
    return this.signin?.get('otp'+n)?.value
  }

  timer$(){
    if(this.timer>0){ this.timer-=1; setTimeout(() => { this.timer$() }, 1000); }
  }
  get contact_number(){
    return this.signin?.get('contact')?.value
  }
  displaySuccess(msg:any){
    this.successMessage=msg
    this.done=true
    setTimeout(() =>{ this.done=false}, 1000);
  }
}
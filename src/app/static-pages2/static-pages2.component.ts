import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductApiService } from '../services/product-api.service';

@Component({
  selector: 'app-static-pages2',
  templateUrl: './static-pages2.component.html',
  styleUrls: ['./static-pages2.component.css']
})
export class StaticPages2Component implements OnInit {
  show!: boolean;
  api_data:any;
  content:any;
  error!: boolean;
  filtered_content:any;
  list:any;
  url!: string;
  show_data!: boolean;
  m_id!: string;
  m_content!: string; 
  mobile_content:Array<any>=[];
  text!: string;
  id!: number;

  constructor(private router:Router,private api:ProductApiService) { }

  ngOnInit(): void {
    let page=this.router.url
    let id:number;
    if(page.includes("/privacy-policy")){ this.url="/privacy-policy"}
    if(page.includes("/about-us")){ this.url="/about-us"}
    if(page.includes("/terms-condition")){ this.url="/terms-condition"}
    if(page.includes("/contact-us")){ this.url="/contact-us"} 
    this.api.getStaticPages(this.url).subscribe({
      next: (value:any) => {
      try{
      this.content=value;
      this.api_data=value["content"]
      const regex=new RegExp(/(?:(<h1>|<h2>|<h3>|<h4>|<h5>|<h6>))(\w|\d|\n|[().,\-:;@#$%^&*\[\]"'+–\/\/®°⁰!?{}|`~]| )+?(?=(<\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/h5>|<\/h6>))/)
      let initial=this.api_data.split('\r\n')
      let list:any=[]
      let final_content:any=[]
      initial.map((value:any)=>{
        if(value.match(regex)){
          if(this.id) this.mobile_content.push({"id":this.id,"value":this.text})
          this.text=""
          const regex1=new RegExp(/<h1>|<h2>|<h3>|<h4>|<h5>|<h6>| <\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/h5>|<\/h6>/, 'g')
          let next=value.replace(regex1,'')
          list.push(next)
          final_content.push({"value":value,id:next})
          this.id=next
        }else{ 
          this.text=this.text+value;
          final_content.push({"value":value,id:""})}
      })
      this.filtered_content=final_content
      this.list=list
    }catch{
      this.error=true;
    }
    },
    error: (err) => {
      this.router.navigate(['/serversideornetworkerrorpage'],{skipLocationChange:true})
    }
  })
  }

  show_details(value:any,id:any){
    this.show_data=true;
    this.m_content=value;
    this.m_id=id;
  }

  @HostListener('scroll', ['$event']) onScroll(event: any) {
    if (event.target.scrollTop >= 1000) {
      this.show=true;
    }else{
      this.show=false;
    }
}


}

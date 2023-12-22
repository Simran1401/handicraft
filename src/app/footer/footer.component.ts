import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ProductApiService } from '../services/product-api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  constructor(private renderer: Renderer2, private router: Router, private api: ProductApiService) { }
  footer: any;
  logo:any;
  ngOnInit() {
    this.api.getFooter().subscribe(data=>{
        this.footer = data;
        console.log(data, 'footer');
      })

      this.api.get_Logo().subscribe(
        (data: any) => {
          this.logo = data;
          console.log(data, 'logo');
        }
      );
  }
}

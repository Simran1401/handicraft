import { Component } from '@angular/core';
import { ProductApiService } from '../services/product-api.service';
import { delay } from 'rxjs';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  constructor( private api: ProductApiService) { }

  loading:boolean = false;
  footer: any;
  ngOnInit() {
    this.loading = true;
    this.api.getFooter().pipe(delay(2000)).subscribe(
      (data: any) => {
        this.footer = data;
        console.log(data, 'footer');
        this.loading = false;
      }
    );
  }
}

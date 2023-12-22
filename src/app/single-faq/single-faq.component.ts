import { Component } from '@angular/core';
import { ProductApiService } from 'src/app/services/product-api.service';
import { catchError, delay } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-single-faq',
  templateUrl: './single-faq.component.html',
  styleUrls: ['./single-faq.component.css']
})
export class SingleFaqComponent {

  constructor(private api:ProductApiService) {}
  faqs: any[] = []; 
  loading:boolean = false;

  ngOnInit(){
    this.loading = true;
    this.api.get_faqs().pipe().subscribe(
      (data: any) => {
        this.faqs = data;
        console.log(data, 'faqs');
        this.loading = false;
      }
    );
  }
}

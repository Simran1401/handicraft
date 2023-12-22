import { Component } from '@angular/core';
import { ProductApiService } from '../services/product-api.service';
import { catchError, delay } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
   constructor(private api:ProductApiService) {}
   features: any;

   ngOnInit(){
    this.api.get_Features().pipe(
      catchError((error) => {
        console.error('Error in subcategory', error);
        return of([]);
      })
    ).subscribe({
      next: (res) => {
        this.features = res;
      },
      error: (err) => {
        console.log('err in features');
      }
    })
   }

   getImagePath(str: any) {
    return `https://hcb.gftpl.in${str}`;
  }
}

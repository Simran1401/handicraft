import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductApiService } from '../services/product-api.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent {
  constructor(private route: ActivatedRoute, private api: ProductApiService) { }
  success!: boolean;
  loading: boolean = false;
  error: boolean = false;
  data:any;
  options: AnimationOptions = {
    path: '/assets/succesfull-payment.json',
    // path: '/assets/payment-failed.json'
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  options2: AnimationOptions = {
    path: '/assets/payment-failed.json'
  };

  animationCreated2(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  options3: AnimationOptions = {
    path: '/assets/server-error.json'
  };

  animationCreated3(animationItem: AnimationItem): void {
    console.log(animationItem);
  }


  ngOnInit() {
    
    this.loading = true;
    this.route.params.subscribe(params => {
      const orderId = params['orderId'];
      console.log(orderId); // Output: ABC123 (if provided)
      const formData = new FormData();
      formData.append('order_id', orderId);

      this.api.check_order_status(formData).subscribe({
        next: (res: any) => {
          console.log('res status', res); // Output: ABC123 (if provided)
          if(res?.isSuccess){
            this.data = res;
            this.success = true;
            this.loading = false;
          } else {
            this.success = false;
            this.loading = false;
          }
        },
        error: (error) => {
          console.log('error');
          this.loading = false;
          this.error = true;
        }
      })
    });
  }
  
}

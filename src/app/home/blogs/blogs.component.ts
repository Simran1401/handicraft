import { Component } from '@angular/core';
import { delay } from 'rxjs';
import { ProductApiService } from 'src/app/services/product-api.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent {
  slideConfig = {
    "slidesToShow": 2, "slidesToScroll": 1,
    autoplay: false,
    dots: true,
    prevArrow: false, // Hide the previous arrow
    nextArrow: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slideToScroll: 1
        }
      }
    ]
  };

  constructor( private api: ProductApiService) { }

  loading:boolean = false;
  blogData: any;
  ngOnInit() {
    this.loading = true;
    this.api.get_Blogs().pipe(delay(2000)).subscribe(
     {
      next:(data:any)=>{
        this.blogData = data;
        console.log(data, 'blogs');
        this.loading = false;
      },
      error:(error)=>{
        this.loading=false;
        console.log(error, 'blog');
        
      }
     }
    );
  }
}
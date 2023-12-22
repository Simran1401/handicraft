import { Component } from '@angular/core';
import { ProductApiService } from '../services/product-api.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent {
  constructor( private api: ProductApiService) { }

  loading:boolean = false;
  blogData: any;
  ngOnInit() {
    this.loading = true;
    this.api.get_Blogs().pipe(delay(2000)).subscribe(
      (data: any) => {
        this.blogData = data;
        console.log(data, 'blogs');
        this.loading = false;
      }
    );
  }
}

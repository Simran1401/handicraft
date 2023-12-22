import { Component } from '@angular/core';
import { ProductApiService } from '../services/product-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-blogs-page',
  templateUrl: './single-blogs-page.component.html',
  styleUrls: ['./single-blogs-page.component.css']
})
export class SingleBlogsPageComponent {
  blogData: any;
  constructor(private api: ProductApiService, private route: ActivatedRoute) { }
  blogdetails: any;
  slug: any;
  loading:boolean = false;

  ngOnInit() {
    this.loading = true;

    this.slug = this.route.snapshot.paramMap.get('slug')

    this.api.getBlogDetail(this.slug).pipe().subscribe(
      (data: any) => {
        this.blogdetails = data;
        console.log(data, 'blogdetails');
        this.loading = false;
      }
    );

    this.loading = true;
    this.api.get_Blogs().subscribe(
      (data: any) => {
        this.blogData = data;
        console.log(data, 'blogs');
        this.loading = false;
      }
    );
  }
}

import { Component, HostListener, OnInit } from '@angular/core';
import { ProductApiService } from '../services/product-api.service';
import { Router } from '@angular/router';
import { delay } from 'rxjs';

@Component({
  selector: 'app-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.css']
})
export class StaticPagesComponent implements OnInit {
  show: boolean = true;
  content: any;
  error: boolean = false;
  filtered_content: any[] = [];
  list: any[] = [];
  url!: string;
  show_data: boolean = true;
  m_id!: string;
  m_content!: string;
  mobile_content: { id: number; value: string; }[] = [];
  loading:boolean = false;

  constructor(private router: Router, private api: ProductApiService) { }

  ngOnInit(): void {
    this.loading = true;
    let page = this.router.url;
    if (page.includes("/privacy-policy")) { this.url = "/privacy-policy"; }
    if (page.includes("/about-us")) { this.url = "/about-us"; }
    if (page.includes("/terms-and-conditions")) { this.url = "/terms-and-conditions"; }
    if (page.includes("/contact-us")) { this.url = "/contact-us"; }
    this.api.getStaticPages(this.url).pipe(delay(2000)).subscribe({
      next: (value: any) => {
        try {
          this.content = value;
          const regex = /\<h[1-6][^>]*\>(.*?)<\/h[1-6]\>/g;
          let initial = value.content.split('\r\n');
          let id = 1;
          let text = "";
          initial.forEach((value: string) => {
            const matches = value.match(regex);
            if (matches && matches.length > 0) {
              const hasPTag = value.includes('<p');
              if (!hasPTag) {
                if (id > 1) {
                  this.mobile_content.push({ "id": id, "value": text });
                  text = "";
                }
                let next = matches[0].replace(/<\/?h[1-6][^>]*>/g, '');
                let ids = next.replace(/\s+/g, "");
                ids = ids.replace(/[^a-zA-Z]/g, "");
                this.list.push({"content": next, "id": ids});
                this.filtered_content.push({ "value": value, id: ids });
                id = parseInt(next, 10);
                console.log('content', id);
              }
            } else if (value.trim() !== '') {
              text = text + value;
              this.filtered_content.push({ "value": value, id: "" });
            }
          });
          if (id > 1) {
            this.mobile_content.push({ "id": id, "value": text });
          }
        } catch {
          this.error = true;
        }
      },
      error: (err) => {
        this.router.navigate(['/serversideornetworkerrorpage'], { skipLocationChange: true })
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  show_details(value: string, id: string): void {
    this.show_data = true;
    this.m_content = value;
    this.m_id = id;
  }
  active = 'top';

}

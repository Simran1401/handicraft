import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductApiService } from '../services/product-api.service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {
  @ViewChild('invoice')
  invoiceElement!: ElementRef;
  company: any;

  constructor(private datePipe: DatePipe, private renderer: Renderer2, private route: ActivatedRoute, private api: ProductApiService) { }
  orders: any;
  order: any;
  loading: boolean = false;
  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe(params => {
      const orderType = params['type'];
      const orderId = params['orderId'];
      console.log(orderType); // Output: homeDelivery
      console.log(orderId); // Output: ABC123 (if provided)
      this.api.company_details().subscribe({
        next: (res: any) => {
          this.company = res;
          console.log(res, 'company');
        },
        error: (error) => {
          console.log('error in company');
        }
      })
      this.api.orders_returns().subscribe({
        next: (res: any) => {
          this.orders = res;
          const ord = this.orders.filter((ord: any) => orderId == ord.id);
          this.order = ord;
          console.log(res, this.order);
        },
        error: (error) => {
          console.log('error');
        },
        complete: () => {
          this.loading = false;
        }
      })
    });
  }

  formatDateTime(timestamp: string): string {
    const formattedDate = this.datePipe.transform(timestamp, 'yyyy-MM-dd');
    const formattedTime = this.datePipe.transform(timestamp, 'hh:mm:ss');
    return formattedDate + ' ' + formattedTime;
  }

  printInvoice() {
    // Make the element temporarily visible
    //this.renderer.setStyle(this.invoiceElement.nativeElement, 'display', 'block');

    // Access the element and retrieve its width
    const elementWidth = this.invoiceElement.nativeElement.offsetWidth;
    const elementHeight = this.invoiceElement.nativeElement.offsetHeight;
    console.log('Element width:', elementWidth);

    // Hide the element again
    //this.renderer.setStyle(this.invoiceElement.nativeElement, 'display', 'none');

    const invoice = this.invoiceElement.nativeElement;

    const htmlWidth = elementWidth;
    const htmlHeight = elementHeight;

    const topLeftMargin = 15;

    let pdfWidth = htmlWidth + (topLeftMargin * 2);
    let pdfHeight = (pdfWidth * 1.5) + (topLeftMargin * 2);

    const canvasImageWidth = htmlWidth;
    const canvasImageHeight = htmlHeight;

    const totalPDFPages = Math.ceil(htmlHeight / pdfHeight) - 1;

    html2canvas(invoice).then(canvas => {

      // canvas.getContext('2d');
      // const imgData = canvas.toDataURL("image/jpeg", 1.0);
      // let pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
      // pdf.addImage(imgData, 'png', topLeftMargin, topLeftMargin, canvasImageWidth, canvasImageHeight);

      // for (let i = 1; i <= totalPDFPages; i++) {
      //   pdf.addPage([pdfWidth, pdfHeight], 'p');
      //   pdf.addImage(imgData, 'png', topLeftMargin, - (pdfHeight * i) + (topLeftMargin * 4), canvasImageWidth, canvasImageHeight);
      // }

      // pdf.save(`Document ${new Date().toLocaleString()}.pdf`);
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var width = pdf.internal.pageSize.getWidth();
      var height = canvas.height * width / canvas.width;
      pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height)
      pdf.save(`invoice_${this.order[0].order_id}`); // Generated PDF
      //this.renderer.setStyle(this.invoiceElement.nativeElement, 'display', 'none');

    });
  }

}

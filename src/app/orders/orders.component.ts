import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ProductApiService } from '../services/product-api.service';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders:any;
  returns:any;
  error: boolean = false;
  loader:boolean = false;
  currentOrderIndex: number = 1;
  modalLoading:boolean = false;
  cancel_reasons:any;
  return_reasons:any;
  selectedReason:any;
  cancel_processing: boolean = false;
  cancel_order: boolean = false;
  return_productList:any;
  return_processing: boolean = false;

  @ViewChild('invoice')
  invoiceElement!: ElementRef;

  constructor(private renderer: Renderer2, private router: Router, private api:ProductApiService, private Token:TokenService, private toastr: ToastrService) { }
  
  ngOnInit(): void {
    this.currentOrderIndex = 1;
    if(this.Token.getHeaders()) {
      this.getData();      
  }
}

getData() {
  this.loader = true;
  const request1 = this.api.orders_returns().pipe(
    catchError((error) => {
      console.error('Error in orders:', error);
      return of([]);
    })
  );;
  const request2 = this.api.get_returns().pipe(
    catchError((error) => {
      console.error('Error in returns:', error);
      return of([]);
    })
  );;
  const request3 = this.api.get_cancellation_reasons().pipe(
    catchError((error) => {
      console.error('Error in cancels', error);
      return of([]);
    })
  );;
  const request4 = this.api.getReasons().pipe(
    catchError((error) => {
    console.error('Error in reasons', error);
    return of([]);
  })
  );;
  
  

  forkJoin([request1, request2, request3, request4]).pipe(delay(2000)).subscribe({
    next: (responses:any) => {
      // Handle the responses
      const response1 = responses[0];
      const response2 = responses[1];
      const response3 = responses[2];
      const response4 = responses[3];

      this.orders = response1;
      this.returns = response2;
      this.cancel_reasons = response3;
      this.selectedReason = this.cancel_reasons[0];
      this.return_reasons = response4

      console.log('Response 1:', response1);
      console.log('Response 2:', response2);
      console.log('Response 3:', response3);
      console.log('Response 4:', response4);

    },
    error: (error:any) => {
      console.error('An error occurred during subscription:', error);
      this.error = true;
    },
   complete: () => {
    this.loader = false;
   } 
});
}

openOrder(i:any){
  this.modalLoading = true;
  this.currentOrderIndex = i;
  this.modalLoading = false;
}

openOrder2(i:any){
this.currentOrderIndex = i;
this.printInvoice()
}

openReturn(i:any){
  this.modalLoading = true;
  this.currentOrderIndex = i;
  this.modalLoading = false;
}

get order(){
  return this.orders[this.currentOrderIndex]
}

get return(){
  return this.returns[this.currentOrderIndex]
}

cancelOrder(i:any){
  this.currentOrderIndex = i;
}

returnOrder(i:any){
  this.return_productList = [];
  this.disableConfirmReturn();
  console.log('Return Order');
  this.currentOrderIndex = i;
}

updateReturnProductsQuantity(event:any, product:any){
  let quantityy = event.target.value;
  if (!this.return_productList || this.return_productList.length === 0) {
    // Array is empty, add a new object
    var newObject = { order_product: product.id, quantity: +quantityy, reason: this.return_reasons[0].id };
    this.return_productList = [newObject];
    return;
  }
  var existingObject = this.return_productList.find((obj:any) => obj.order_product === product.id);

  if (existingObject) {
    existingObject.quantity = +quantityy;
  } else {
    var newObject = { order_product: product.id, quantity: +quantityy, reason: this.return_reasons[0].id };
    this.return_productList.push(newObject);
  }
  console.log(this.return_productList, 'products');
  this.disableConfirmReturn();
}

checkReason(reason:any){
  let array = this.return_reasons;
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if(element.title == reason){
      return element.id;
    }
  }
}

updateReturnProductsReason(event:any, product:any){
  let reasons = event.target.value;

  if (!this.return_productList || this.return_productList.length === 0) {
    // Array is empty, add a new object
    var newObject = { order_product: product.id, quantity: 0, reason:  this.checkReason(reasons)};
    this.return_productList = [newObject];
    return;
  }

  var existingObject = this.return_productList.find((obj:any) => obj.order_product === product.id);

  if (existingObject) {
    existingObject.reason = this.checkReason(reasons);
  } else {
    var newObject = { order_product: product.id, quantity: 0, reason: this.checkReason(reasons) };
    this.return_productList.push(newObject);
  }
  console.log(this.return_productList, 'products')
}

disableConfirmReturn(){
  if(this.return_productList.length > 0){
  for (let index = 0; index < this.return_productList.length; index++) {
    const element = this.return_productList[index]; 
    if(Number(element.quantity) > 0){
      this.return_processing = false;
      return;
    }
  }
  this.return_processing = true;
} else {
  this.return_processing = true;
}
}

confirmReturn(order_id:any){
  const formData = new FormData();
  let returndata = [];
  let cart:any = this.return_productList;
  if(this.return_productList?.length > 0){
    for (let index = 0; index < cart.length; index++) {
      const element = cart[index]; 
      if(Number(element.quantity) > 0){
        returndata.push({"order_product": element.order_product, "quantity": Number(element.quantity), "reason": element.reason})
      }
    }
  }
  if(returndata.length > 0){
    this.return_processing = true;
    formData.append('order_id', JSON.stringify(order_id));
  formData.append('json', JSON.stringify(returndata));

  this.api.return_order(formData).subscribe({
    next: (data) => {
      console.log(data, 'order');
      this.afterReturn(data);
    },
    error: (err) => {
      console.log('err order', err);
      this.toastr.error("Error occured while returning order!");
      this.return_processing = false;
    }
  })
  } else {
    console.log('error in order')
    this.toastr.error("Quantity is Zero");
  }
  
}

afterReturn(val:any){
  if(val["Message"]){ 
    this.return_processing = false;
    this.toastr.success("Order return successfully");
    this.getData();
    var clicking = <HTMLElement>document.querySelector('.returnModal');
    clicking.click();
  }
  if(val["Error"]) {
    this.return_processing = false;
    this.toastr.error(val['Error']);
  }
}

confirmCancel(order_id:any){
  if(this.selectedReason.id){
    this.cancel_processing=true;
    this.api.cancel_order(order_id, +this.selectedReason.id).subscribe({
      next: (val:any)=>{
        console.log(val, 'order cancelled')
      if(val["Message"]){ 
        this.toastr.success("Order cancelled successfully");
        this.getData();
        var clicking = <HTMLElement>document.querySelector('.cancelModal');
        clicking.click();
        this.cancel_order=false
      }
      if(val["Error"]) {
        this.toastr.error("Error while cancelling order!");
      }
      var clicking = <HTMLElement>document.querySelector('.cancelModal');
      this.cancel_processing=false;
    },
    error: (err) => {
      console.log('error',err);
      this.toastr.error("Error while cancelling order!");
      this.cancel_processing = false;
    }
  });
  } 
  else{ 
    this.toastr.error("Please select a reason for Order Cancellation")
    this.cancel_processing=false;
    console.log('err in reasons')
  }
}

createArrayUpToNumber(number:any) {
  var array = [];
  
  for (var i = 0; i <= number; i++) {
    array.push(i);
  }
  
  return array;
}

navigateToInvoice(type: string, orderId?: string) {
  this.router.navigate(['/invoice', type, orderId]);
}

// printInvoice(): void {
//   const invoice = this.invoiceElement.nativeElement;
//   html2canvas(invoice).then((canvas) => {
//     const imageData = canvas.toDataURL('image/jpeg'); // Convert to JPEG format
//     const doc = new jsPDF('p', 'mm', 'a4');
//     const width = doc.internal.pageSize.getWidth();
//     const scaleFactor = width / canvas.width;
//     const height = canvas.height * scaleFactor;
//     doc.addImage(imageData, 'JPEG', 0, 0, width, height);
//     doc.save('generated.pdf');


//   });
        
  
// }

printInvoice() {
  // Make the element temporarily visible
  this.renderer.setStyle(this.invoiceElement.nativeElement, 'display', 'block');

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
pdf.save('output.pdf'); // Generated PDF
this.renderer.setStyle(this.invoiceElement.nativeElement, 'display', 'none');

  });
}

}

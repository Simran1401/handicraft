import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { ProductsPageComponent } from './products-page/products-page.component';
import { SingleProductPageComponent } from './single-product-page/single-product-page.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { ToastrModule } from 'ngx-toastr';
import { CheckoutComponent } from './checkout/checkout.component';
import { MyCartComponent } from './my-cart/my-cart.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './login/login.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AddressComponent } from './address/address.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxPaginationModule} from 'ngx-pagination';
import { CartComponent } from './cart/cart.component'; // <-- import the module
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { WishlistComponent } from './wishlist/wishlist.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { RoundProgressModule, ROUND_PROGRESS_DEFAULTS } from 'angular-svg-round-progressbar';
import { StaticPages2Component } from './static-pages2/static-pages2.component';
import { FeaturesComponent } from './features/features.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { DatePipe } from '@angular/common';
import { SingleFaqComponent } from './single-faq/single-faq.component';
import { BlogsComponent } from './home/blogs/blogs.component';
import { SingleBlogsPageComponent } from './single-blogs-page/single-blogs-page.component';
import { BlogListComponent } from './blog-list/blog-list.component';


export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ProductsPageComponent,
    SingleProductPageComponent,
    SearchboxComponent,
    StaticPagesComponent,
    CheckoutComponent,
    MyCartComponent,
    ContactUsComponent,
    LoginComponent,
    AddressComponent,
    AccountsComponent,
    OrdersComponent,
    ProfileComponent,
    CartComponent,
    WishlistComponent,
    StaticPages2Component,
    FeaturesComponent,
    InvoiceComponent,
    PaymentStatusComponent,
    SingleFaqComponent,
    BlogsComponent,
    SingleBlogsPageComponent,
    BlogListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    SlickCarouselModule,
    NgbModule,
    NgxSkeletonLoaderModule,
    RoundProgressModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  providers: [{ provide: ROUND_PROGRESS_DEFAULTS,
    useValue: {
      color: '#f00',
      background: '#0f0'
    }}, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
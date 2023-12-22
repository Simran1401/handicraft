import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsPageComponent } from './products-page/products-page.component';
import { SingleProductPageComponent } from './single-product-page/single-product-page.component';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MyCartComponent } from './my-cart/my-cart.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HeaderComponent } from './header/header.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AddressComponent } from './address/address.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { AccountGuard } from './guards/account.guard';
import { StaticPages2Component } from './static-pages2/static-pages2.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { SingleFaqComponent } from './single-faq/single-faq.component';
import { SingleBlogsPageComponent } from './single-blogs-page/single-blogs-page.component';
import { BlogListComponent } from './blog-list/blog-list.component';

const routes: Routes = [
  {
    path: '', component: HeaderComponent, children: [
      { path: '', component: HomeComponent, data: { title: "OJ-Ease" } },
      { path: 'p/:productId', component: SingleProductPageComponent },
      { path: 'c/p/:category', component: ProductsPageComponent },
      { path: 'sc/p/:subcategory', component: ProductsPageComponent },
      { path: 'b/p/:brand', component: ProductsPageComponent },
      { path: 'o/p/:other', component: ProductsPageComponent },
      { path: 'search/p/:searchId', component: ProductsPageComponent },
      // {path:'serversideornetworkerrorpage',component:NetworkComponent,data:{title:"Click 4 Needs | Buy Grocery Products Online"}},
      {
        path: 'myaccount', component: AccountsComponent, data: { title: "OJ-Ease | My Account" }, canActivate: [AccountGuard], children: [
          { path: 'address', component: AddressComponent, data: { title: "My Account | Address" } },
          { path: 'user-identity', component: ProfileComponent, data: { title: "My Account | User Identity" } },
          { path: 'order-returns', component: OrdersComponent, data: { title: "My Account | Orders & Returns" } },
          { path: '', redirectTo: 'user-identity', pathMatch: 'full' }
        ]
      },
      { path: 'invoice/:type/:orderId', component: InvoiceComponent, data: { title: "My Account | Orders & Returns" } },
        {path:'about-us', component:StaticPagesComponent,data:{title:"Click 4 Needs | About Us"}},
        {path:'privacy-policy', component:StaticPagesComponent,data:{title:"Click 4 Needs | Privacy Policy"}},
        {path:'terms-and-conditions', component:StaticPagesComponent,data:{title:"Click 4 Needs | Terms & Conditions"}},
    ]
  },
  { path: 'contact-us', component: ContactUsComponent, data: { title: "OJ-Ease | Contact Us" } },
  { path: 'faqs', component: SingleFaqComponent, data: { title: "OJ-Ease | FAQs" } },
  { path: 'blog-list', component: BlogListComponent, data: { title: "OJ-Ease | Blog List" } },
  { path: 'blog-details/:slug', component: SingleBlogsPageComponent, data: { title: "OJ-Ease | Blog Details" } },
  { path: 'checkout', component: CheckoutComponent, data: { title: "Order Checkout" } },
  { path: 'payment-status/:orderId', component: PaymentStatusComponent, data: { title: "Payment Status" } },
  { path: 'my-cart', component: MyCartComponent, data: { title: "My Account" } },
  { path: 'wishlist', component: WishlistComponent, data: { title: "Wishlist" }, canActivate: [AccountGuard] },
  { path: '**', redirectTo: "/", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { MaterialRoutes } from './material.routing';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { MenuComponent } from './dialog/menu/menu.component';
import { ChangePasswordComponent } from './dialog/change-password/change-password.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';
import { ManageSalesComponent } from './manage-sales/manage-sales.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderComponent } from './dialog/order/order.component';
import { MatSelectModule } from '@angular/material/select';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { ManageDeliveriesComponent } from './manage-deliveries/manage-deliveries.component';
import { CustomerComponent } from './dialog/customer/customer.component';
import { DeliveriesComponent } from './dialog/deliveries/deliveries.component';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProfileComponent } from './dialog/profile/profile.component';






@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    NgSelectModule,
    FlexLayoutModule,
    MatSelectModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    MatMomentDateModule,
    MatSnackBarModule,
    NgxQrcodeStylingModule,
    MatSlideToggleModule,
    //NgxQRCodeModule 
   // QRCodeModule
    //NgxQRCodeModule,

  ],
  providers: [],
  declarations: [
    ViewBillProductsComponent,
    ChangePasswordComponent,
    ConfirmationComponent,
    ManageMenuComponent,
    MenuComponent,
    ManageOrderComponent,
    ManageProfileComponent,
    ManageSalesComponent,
    OrderComponent,
    ManageDeliveriesComponent,
    CustomerComponent,
    DeliveriesComponent,
    ProfileComponent    
  ]
})
export class MaterialComponentsModule {}

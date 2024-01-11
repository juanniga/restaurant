import { Routes } from '@angular/router';
import { RouterGuardService } from '../services/router-guard.service';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';
import { ManageSalesComponent } from './manage-sales/manage-sales.component';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component';
import { ManageDeliveriesComponent } from './manage-deliveries/manage-deliveries.component';

export const MaterialRoutes: Routes = [
    {
        path:'menu',
        component:ManageMenuComponent,
        canActivate:[RouterGuardService],
        data:{
            expectedRole:['admin']
        }
       
    }
    ,{
        path:'sales',
        component:ManageSalesComponent,
        canActivate:[RouterGuardService],
        data:{
            expectedRole:['admin','user']
        }
    }
    ,{
        path:'order',
        component: ManageOrderComponent,
        canActivate:[RouterGuardService],
        data:{
            expectedRole:['admin','user']
        }
    }
    
    ,{
        path:'profile',
        component:ManageProfileComponent,
        canActivate:[RouterGuardService],
        data:{
            expectedRole:['admin','user']
        }
    },
    {
        path:'ticket',
        component:ViewBillProductsComponent,
        canActivate:[RouterGuardService],
        data:{
            expectedRole:['admin','user']
        }
    },
    {
        path:'deliveries',
        component:ManageDeliveriesComponent,
        canActivate:[RouterGuardService],
        data:{
            expectedRole:['admin','user']
        }
    }
];
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MaterialModule } from '../shared/material.module';
import { DashboardRoutes } from "./dashboard.routing";

import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardComponent } from "./dashboard.component";
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }

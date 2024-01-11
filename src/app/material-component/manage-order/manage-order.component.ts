import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { MenuService } from 'src/app/services/menu.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SubUserService } from 'src/app/services/sub-user.service';
import { GlobalConstans } from 'src/app/shared/global-constans';
import { OrderComponent } from '../dialog/order/order.component';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/model/order';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns:string[]=['name','number_order','status','fecha','view'];
  dataSource:any=[];
  manageSalesForm:any=FormGroup;
  ord:any;
  dato: any;
  perfil_id: any;
  responseMessage: any;
  constructor(
    private formBuilder:FormBuilder,
    public firedatabase:AngularFireDatabase,
    public orderservice:OrderService,
    private dialog:MatDialog,
    private route:Router,
    private ngxService: NgxUiLoaderService,
    private sanackService:SnackbarService
  ){}
  ngOnInit(): void {
    this.ngxService.start();
    this.manageSalesForm = this.formBuilder.group({
      initialDate:[null,[Validators.required]],
      finalDate:[null,[Validators.required]],
      paymentMethod: [null, [Validators.required]],
    });
    this.tableData();
  }
  tableData(){
   /* this.dataSource = this.firedatabase.list('orden/1/');
    console.log("============",this.dataSource)*/
    this.ngxService.stop();
    this.dato = localStorage.getItem('perfil');
    this.perfil_id = JSON.parse(this.dato);
    this.orderservice.getOrderCustomers(this.perfil_id[0].id).snapshotChanges().subscribe((item)=>{
      this.dataSource=[];
      item.forEach(element =>{
        this.ord = element.payload.toJSON();
        this.ord['$key'] = element.key;
        this.dataSource?.push(this.ord as Order);
        
      });
      this.dataSource.sort((a:any,b:any)=>a.number_order - b.number_order);
      
    })
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  handleViewAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      data:values
    };
    dialogConfig.width="950px";
    const dialogRef = this.dialog.open(OrderComponent,dialogConfig);
    this.route.events.subscribe(()=>{
      dialogRef.close();
    })
  }
  handleViewDelete(values:any){
    //this.ngxService.start();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      message:'Eliminar'+' la orden No '+values.number_order
    }
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.delete_order(values);
      dialogRef.close();
    })
  
   
  }
  delete_order(values: any) {
    //eliminacion mysql
    this.orderservice.delete(values.id_detail).subscribe(
      {

        next:(response:any)=>{
          this.ngxService.stop();
          this.responseMessage = response?.message;
          this.sanackService.openSnackBar(this.responseMessage,"");
          //eliminacion por firebase
          this.orderservice.deleteOrder(values.id_detail+this.perfil_id[0].id);
          
        },
        error:error=>{
          this.ngxService.stop();
          if(error.error?.message){
            this.responseMessage = error.error?.message;
          }else{
            this.responseMessage = GlobalConstans.genericError;
          }
          this.sanackService.openSnackBar(this.responseMessage,GlobalConstans.error);
        }}
    );
    
  }
}

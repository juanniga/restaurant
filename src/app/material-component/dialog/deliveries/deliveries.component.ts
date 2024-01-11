import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as saveAs from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { OrderService } from 'src/app/services/order.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstans } from 'src/app/shared/global-constans';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total'];
  dataSource: any;
  data: any;
  dato:any;
  perfil:any;
  totalAmount: any=0;
  responseMessage:any;
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<DeliveriesComponent>,
    private serviceOrder: OrderService,
    public snackBarService:SnackbarService,
    private ngxService: NgxUiLoaderService,
    private billService:BillService) { }
  ngOnInit() {
    this.data = this.dialogData.data;
    console.log("ID DETAIL " + this.data.id," iddd ",this.data)
    this.dataTable(this.data.id,this.data.id_sub);
    // this.dataSource = JSON.parse(this.dialogData.data.productDetails);
  }
  dataTable(id_detail:any,id_sub:any) {
    this.dato=localStorage.getItem('perfil');
		this.perfil = JSON.parse(this.dato);
    var datas = {
      id_detail_sub_user: id_detail,
      id_sub_user: id_sub,
      id_admin: this.perfil[0].id,
      status:"entregado"
    }
    this.serviceOrder.getOrderSubUser(datas).subscribe((response: any) => {
      this.dataSource = response;
      this.dataSource.forEach((element: any) => {
        this.totalAmount = (element.quantity * element.price)+this.totalAmount;
        console.log("TOTAL ", this.totalAmount )

      });
      //this.dataSource = new MatTableDataSource(response);
      this.totalAmount = Number(this.totalAmount.toFixed(2));
      console.log("RESPONSE ",this.dataSource)
    });
  }
  getPdf(){
    this.dato = localStorage.getItem("perfil");
    this.perfil = JSON.parse(this.dato);
    console.log("PROFILE ",this.perfil);
    this.ngxService.start();


    
    var data = {
      phone: this.perfil[0].phone,
      name_rest: this.perfil[0].name_rest.toUpperCase(),
      location:this.perfil[0].location.toUpperCase(),
      name: this.data.name.toUpperCase(),
      email: this.data.email,
      contactNumber: this.data.contactNumber,
      paymentMethod: this.data.paymentMethod,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource)
    }
    this.billService.generateReport(data).subscribe((response: any) => {
      saveAs(response, this.perfil[0].user + '.pdf');
      this.ngxService.stop();
      this.dialogRef.close();
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstans.error);
    });

















    /*
    console.log("delivery ",this.data.id_detail+"1")
    this.dato=localStorage.getItem('perfil');
		this.perfil_id = JSON.parse(this.dato);
    var datas = {
      id:this.data.id_detail,
      status:"entregado"
    }
    this.serviceOrder.update(datas).subscribe((response)=>{
      this.dialogRef.close();
      this.responseMessage = "Se actualizo correctamente";
      this.snackBarService.openSnackBar(this.responseMessage,"Success");
      this.serviceOrder.removeCustomer(this.data.id_detail+this.perfil_id[0].id);
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstans.error);
    });*/
  }
}

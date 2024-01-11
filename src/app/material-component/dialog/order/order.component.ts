import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstans } from 'src/app/shared/global-constans';
import { OrderService } from 'src/app/services/order.service';
import { CustomerComponent } from '../customer/customer.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'price','note', 'quantity', 'total'];
  dataSource: any;
  data: any;
  dato:any;
  perfil_id:any;
  totalAmount: any=0;
  responseMessage:any;
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<OrderComponent>,
    private serviceOrder: OrderService,
    public snackBarService:SnackbarService) { }
  ngOnInit() {
    this.data = this.dialogData.data;
    console.log("ID DETAIL " + this.data.id)
    this.dataTable(this.data.id_detail,this.data.id);
    // this.dataSource = JSON.parse(this.dialogData.data.productDetails);
  }
  dataTable(id_detail:any,id_sub:any) {
    this.dato=localStorage.getItem('perfil');
		this.perfil_id = JSON.parse(this.dato);
    var datas = {
      id_detail_sub_user: id_detail,
      id_sub_user: id_sub,
      id_admin: this.perfil_id[0].id,
      status:"ordenado"
    }
    this.serviceOrder.getOrderSubUser(datas).subscribe((response: any) => {
      this.dataSource = response;
      this.dataSource.forEach((element: any) => {
        this.totalAmount = (element.quantity * element.total)+this.totalAmount;
        console.log("TOTAL ", this.totalAmount )

      });
      //this.dataSource = new MatTableDataSource(response);
      this.totalAmount = Number(this.totalAmount.toFixed(2));
      console.log("RESPONSE ",this.dataSource)
    });
  }
  deliveryOrder(){
    console.log("delivery ",this.data.id_detail+"1");
    
    this.dato=localStorage.getItem('perfil');
		this.perfil_id = JSON.parse(this.dato);
    var datas = {
      id:this.data.id_detail,
      status:"entregado",
      
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
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from 'src/app/services/order.service';
import { OrderComponent } from '../dialog/order/order.component';
import { Router } from '@angular/router';
import { DeliveriesComponent } from '../dialog/deliveries/deliveries.component';
import { GlobalConstans } from 'src/app/shared/global-constans';
import { BillService } from 'src/app/services/bill.service';
import * as saveAs from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SubUserService } from 'src/app/services/sub-user.service';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import * as moment from 'moment';


@Component({
  selector: 'app-manage-deliveries',
  templateUrl: './manage-deliveries.component.html',
  styleUrls: ['./manage-deliveries.component.scss']
})
export class ManageDeliveriesComponent implements OnInit {
  manageDeliveriesForm: any = FormGroup;
  dataSource: any = [];
  dataSource_json: any = [];
  dataSource_report: any = [];
  displayedColumns: string[] = ['name', 'status', 'date','all_total', 'view'];
  dato: any;
  perfil: any;
  responseMessage: any;
  totalAmount: number = 0;
  grand_totalAmount:number=0;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  constructor(private formBuilder: FormBuilder,
    private orderService: OrderService,
    private dialog: MatDialog,
    private route: Router,
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private subUserService: SubUserService,) { }
  ngOnInit() {
    this.manageDeliveriesForm = this.formBuilder.group({
      initialDate: [null, [Validators.required]],
      finalDate: [null, [Validators.required]],
      paymentMethod: [null, [Validators.required]],
    });
    this.tableData();
  }
  tableData() {
    this.grand_totalAmount=0;
    this.dato = localStorage.getItem('perfil');
    this.perfil = JSON.parse(this.dato);
    var datas = {
      id_admin: this.perfil[0].id
    }
    this.orderService.getDeliveries(datas).subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource_report = response;
      this.dataSource.paginator = this.paginator;
      //  this.dataSource_json= response;
      this.dataSource_report.forEach((element: any) => {
        this.grand_totalAmount = this.grand_totalAmount+parseFloat(element.all_total);
        //console.log("TOTAL ", this.grand_totalAmount)

      });
      
      this.grand_totalAmount = Number(this.grand_totalAmount.toFixed(2));
      console.log("TOTALx ", this.grand_totalAmount)
    });
  }



  applyFilter(event: Event) {
    console.log("Evente ", event.target)
    const filterValue = (event.target as HTMLInputElement).value;
    //const filterValue = 'roberto';
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }
  handleViewDeliveries(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values
    }
    dialogConfig.width = "100%";
    const dialogref = this.dialog.open(DeliveriesComponent, dialogConfig);
    this.route.events.subscribe(() => {
      dialogref.close();
    })
  }
  handleViewPdf(element: any) {
    console.log(element.date);
    this.totalAmount = 0;
    this.dato = localStorage.getItem("perfil");
    this.perfil = JSON.parse(this.dato);
    //console.log("PROFILE ",this.perfil);
    this.ngxService.start();
    //console.log("ELEMENT ",element)
    var data1 = {
      id_detail_sub_user: element.id,
      id_sub_user: element.id_sub,
      id_admin: this.perfil[0].id,
      status: "entregado"
    }
    this.subUserService.getOrders(data1).subscribe((response) => {
      console.log("Hola ", response);
      this.dataSource_json = response;
      this.dataSource_json.forEach((element: any) => {

        this.totalAmount = this.totalAmount + (element.price * element.quantity);

      });
      this.totalAmount = Number(this.totalAmount.toFixed(2));
      console.log(this.totalAmount);


      var data = {
        date:element.date,
        phone: this.perfil[0].phone,
        name_rest: this.perfil[0].name_rest.toUpperCase(),
        location: this.perfil[0].location.toUpperCase(),
        name: element.name.toUpperCase(),
        email: element.email,
        contactNumber: element.contactNumber,
        paymentMethod: element.paymentMethod,
        totalAmount: this.totalAmount,
        productDetails: JSON.stringify(this.dataSource_json)
      }
      this.billService.generateReport(data).subscribe((response: any) => {
        saveAs(response, this.perfil[0].user + '.pdf');
        this.ngxService.stop();

      });


    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstans.error);
    });

  }
  getOrderSubUser(data1: any, element: any) {


  }
  handleViewDelete(element: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Eliminar ' + element.name + ' menu'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteMenu(element.id);
      dialogRef.close();
    })
  }
  deleteMenu(id: any) {
    console.log("ID_DETAIL", id)

    this.orderService.delete(id).subscribe((response: any) => {
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "Succes");
    }, (error) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstans.error);
    })
  }












  searchTo() {
    var formData = this.manageDeliveriesForm.value;
    this.grand_totalAmount=0
    /*if (formData.initialDate != null && formData.finalDate !=null) {
      const _fechaInicio: any = (formData.initialDate).format('DD/MM/YYYY')
      const _fechaFin: any = (formData.finalDate).format('DD/MM/YYYY');
      var someDateString = moment().format("DD/MM/YYYY");
      // var someDate = moment(formData.initialDate+"", "DD/MM/YYYY");

      console.log("FECHA INICIO ", _fechaInicio, " ff ", _fechaFin);
    }*/


    //var formData = this.manageDeliveriesForm.value;

    if (formData.initialDate != null && formData.finalDate != null) {
      const _fechaInicio: any = (formData.initialDate).format('DD-MM-YYYY')
      const _fechaFin: any = (formData.finalDate).format('DD-MM-YYYY');
      this.snackbarService.openSnackBar("Se encontraron datos", '');

      var moment = require('moment');

      // obtener el nombre del mes, día del mes, año, hora
      var now = moment().format("DD-MM-YYYY HH:mm:ss A");
      console.log("====================",now);
      if (_fechaInicio <= _fechaFin) {
        /*  const _fechaInicio: any = (formData.initialDate).format('DD/MM/YYYY')
          const _fechaFin: any = (formData.finalDate).format('DD/MM/YYYY');
          var someDateString = moment().format("DD/MM/YYYY");
          // var someDate = moment(formData.initialDate+"", "DD/MM/YYYY");*/
        var data = {
          id_admin: "1",
          names1: _fechaInicio,
          names2: _fechaFin
        }
        this.orderService.getDeliveriesDate(data).subscribe((response: any) => {
          this.dataSource_report = response;
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          console.log("DATA TABLE ",data);

          this.dataSource_report.forEach((element: any) => {
          this.grand_totalAmount = parseFloat(element.all_total)+this.grand_totalAmount;
      //   console.log("TOTAL ", this.grand_totalAmount);
    
          });
          this.grand_totalAmount = Number(this.grand_totalAmount.toFixed(2));

        //  this.tableData();
        })
        console.log("FECHA FINAL ", _fechaFin, now);
      } else {
        console.log("FECHA INICIAL ", _fechaInicio, now);
        this.tableData();
      }
    } else {
      this.snackbarService.openSnackBar("No se encontraron datos", 'error');
      this.tableData();

    }
 
  }

  filePdf(){
    this.ngxService.start();
    this.dato = localStorage.getItem("perfil");
    this.perfil = JSON.parse(this.dato);
    var data = {
      phone: this.perfil[0].phone,
      name_rest: this.perfil[0].name_rest.toUpperCase(),
      location: this.perfil[0].location.toUpperCase(),
      grand_totalAmount:this.grand_totalAmount,
      email: this.perfil[0].user,
      contactNumber: '',
      paymentMethod: '',
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource_report)
    }
    console.log(this.dataSource_report)
    this.billService.generateReports(data).subscribe((response: any) => {
      saveAs(response, this.perfil[0].user + '.pdf');
      this.ngxService.stop();
      //this.ngxService.stop();

    });
  }
  cleaning(){
    this.manageDeliveriesForm.controls['finalDate'].setValue('');
    this.manageDeliveriesForm.controls['initialDate'].setValue('');
    this.tableData();
  }





  submitAction() {

  }
}

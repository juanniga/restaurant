import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MenuService } from 'src/app/services/menu.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstans } from 'src/app/shared/global-constans';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MenuComponent } from '../dialog/menu/menu.component';

@Component({
  selector: 'app-manage-menu',
  templateUrl: './manage-menu.component.html',
  styleUrls: ['./manage-menu.component.scss']
})
export class ManageMenuComponent implements OnInit {
  displayedColumns:string[]=['image','name','name_category','price','discount','description','edit'];
  dataSource:any;
  responseMessage:any;
  dato:any;
  perfil_id:any;
  data:any;
  @ViewChild(MatPaginator) paginator?:MatPaginator;
  constructor(private menuService:MenuService,
    private ngxService:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackBarService:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
    
  }
  tableData(){
    this.dato=localStorage.getItem('perfil');
		this.perfil_id = JSON.parse(this.dato);
		var datas = {
			id_user_ad:this.perfil_id[0].id
			}
    this.menuService.getMenus(datas).subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
     // this.data = response;
      console.log("*************",response);
    },(error)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstans.error);
    })
  }
  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  handleAction(){
   // console.log("************///// false")
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      action:'Agregar',
      valor:false
    }
    dialogConfig.width='850px';
    const dialogRef = this.dialog.open(MenuComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onAddMenu.subscribe((response:any)=>{
      console.log("respuesta desde ventana emergente",response)
      if(response){
        this.tableData();
      }else{
        this.tableData();
      }
    })
  }
  handleEditAction(values:any){
   // console.log("************///// true")
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data={
      action:"Editar",
      data:values,
      valor:true
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(MenuComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onEditMenu.subscribe(
      (response)=>{
        this.tableData();
      }
    )
  }
  handleDeleteAction(element:any){
    console.log("DELETE ",element.id);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message:'Eliminar'+element.name+' menu'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.deleteMenu(element);
     console.log("IMAGEN ",element.image)
      dialogRef.close();
    })
  }
  deleteMenu(element:any) {
    var data={
      id:element.id,
      image:element.image
    }
    this.menuService.delete(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackBarService.openSnackBar(this.responseMessage,"Success");
    },(error)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstans.error);
    })
  }
  onChange(statu:any,ids:any){
    var data = {
      status:statu.toString(),
      id:ids
    }
    console.log("DATA ",data)
    this.menuService.updateStatus(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstans.error);
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstans.error);
    });
  }
  getnumber(price:any,discount:any){
    let total = Number((price-(price*discount/100)).toFixed(2));
    
    return total;
  }
}

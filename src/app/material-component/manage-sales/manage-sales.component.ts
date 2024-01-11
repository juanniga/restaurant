import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { MenuService } from 'src/app/services/menu.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SubUserService } from 'src/app/services/sub-user.service';
import { GlobalConstans } from 'src/app/shared/global-constans';
import { OrderComponent } from '../dialog/order/order.component';
import { BillService } from 'src/app/services/bill.service';
import { saveAs } from 'file-saver';
import { OrderService } from 'src/app/services/order.service';
import { CustomerComponent } from '../dialog/customer/customer.component';
@Component({
  selector: 'app-manage-sales',
  templateUrl: './manage-sales.component.html',
  styleUrls: ['./manage-sales.component.scss']
})
export class ManageSalesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity','note', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  subUsers: any = [];
  subUsers1: any = [];
  id_sub_user: any = [];
  menus: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;
  dato: any;
  perfil_id: any;
  selected: any;
  statusClienteTxt: any = "Agregar";
  status_btn: any = 0;
  id_detail: any;
  variable_btn: boolean = true;

  perfil: any


  //itemsListMaxHeight:any;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private menuService: MenuService,
    private subUserService: SubUserService,
    public snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private router: Router,
    private billService: BillService,
    private orderService:OrderService,
    
    
  ) {

  }
  /*arreglo1 = [10, 20, 30, 40, 50];

  rastrearPor(indice: number, elemento: number) {
    console.log(indice, elemento);
  }*/
  ngOnInit(): void {
    console.log("variable btn ", this.variable_btn)
    this.ngxService.start();
    this.getCategorys();
    this.getSubUsers();

    //this.getSubUserById();
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstans.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstans.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstans.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      menu: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
      subUser: [null, [Validators.required]],
      note:[null],
    })
  }
  getSubUsers() {
    let cont = 0;
    this.subUserService.getSubUsers().subscribe((response: any) => {
      this.ngxService.stop();
      this.subUsers = response;
      /* if(this.subUsers.length>4){
         for (let i = this.subUsers.length; i > this.subUsers.length-4; i--) {
           this.subUsers1[cont]=this.subUsers[i-1];
           cont=cont + 1;
        
         }
         this.subUsers=this.subUsers1;
         
       }*/


      //console.log("sub users", this.subUsers);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstans.error);
    })
  }
  getSubUserById(value: any) {
    this.totalAmount = 0;

    //console.log("NOMBRE3", value);
    if (value != null) {
      //console.log("NOMBRE3", value);
      this.subUserService.getById(value).subscribe((response: any) => {
        this.id_sub_user = response[0].id;
        this.statusClickUser(this.id_sub_user);
        this.manageOrderForm.controls['name'].setValue(response[0].name);
        this.manageOrderForm.controls['email'].setValue(response[0].email);
        this.manageOrderForm.controls['contactNumber'].setValue(response[0].phone);
        console.log("NOMBRE3a", response[0], " ", this.id_sub_user);
        // this.getOrderSubUser();
      })
    } else {

      this.manageOrderForm.controls['name'].setValue(null);
      this.manageOrderForm.controls['email'].setValue(null);
      this.manageOrderForm.controls['contactNumber'].setValue(null);
      this.status_btn = 0;
      this.validateProductAdd();
      this.variable_btn = true;
      this.totalAmount = 0;
      this.statusClickUser(-1);

    }
  }
  getCategorys() {
    this.categoryService.getCategorys().subscribe((response: any) => {
      this.ngxService.stop();
      this.categorys = response;
      // console.log("categorias",this.categorys);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstans.error);
    })
  }
  getMenuByCAtegory(value: any) {
    this.dato = localStorage.getItem('perfil');
    this.perfil_id = JSON.parse(this.dato);
    console.log("productos ", value);
    var data = {
      id_categ: value.id,
      id_user_ad: this.perfil_id[0].id

    }
    this.menuService.getMenuByCategory(data).subscribe((response: any) => {
      //   this.products = Object.values(response);
      this.menus = response;
    //  console.log("productos ", data);
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);

    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstans.error);
    })
    //console.log("productos ",this.menus)
    // console.log("Categorias ",this.categorys)
  }
  getMenuDetails(value: any) {
    this.dato = localStorage.getItem('perfil');
    this.perfil_id = JSON.parse(this.dato);
    var data = {
      id: value.id,
      id_user_ad: this.perfil_id[0].id
    }
    this.menuService.getById(data).subscribe((response: any) => {
      this.price = response.price;
      this.manageOrderForm.controls['price'].setValue(response.price);
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.price * 1);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstans.error);
    })
  }
  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value)
    } else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value)
    }
  }
  validateProductAdd() {
    if (this.manageOrderForm.controls['total'].value === 0 || this.status_btn === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.controls['quantity'].value <= 0) {
      return true;
    } else {
      return false;
    }
  }
  validateSubmit() {
    if (this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null ||
      this.manageOrderForm.controls['email'].value === null || this.manageOrderForm.controls['contactNumber'].value === null || this.manageOrderForm.controls['paymentMethod'].value === null) {
      return true;
    } else {
      return false;
    }
    /*if (this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null ||
      this.manageOrderForm.controls['email'].value === null || this.manageOrderForm.controls['contactNumber'].value === null ||
      this.manageOrderForm.controls['paymentMethod'].value === null ||
      !(this.manageOrderForm.controls['contactNumber'].valid) || !(this.manageOrderForm.controls['email'].valid)) {
      return true;
    } else {
      return false;
    }*/

  }

  add() {
    this.totalAmount = 0;
    //this.dataSource=0;
    // this.getSubUsers();
    this.statusClickUser(this.id_sub_user);
    //console.log("Hola desde aqui ", this.status_btn, " id ", this.id_detail);
    //PRIMERO DEBEMOS PREGUNTAR SI LAS CASILLAS DE USUARIO CLIENTE ESTEN LLENAS 
    // SI ES ASI RECIEN AGREGAR SI NO ENTONCES DEBEMOS VALIDAR LOS CAMPOS DE USUARIO CLIENTE Y AGREGAR RECIEN.


    // Y SI EN ALGUN CASO EL USUARIO CLIENTE YA ENTRO POR LA APLICACION Y YA TIENE PRODUCTO ENTONCES MOSTRAR EN LA TABLA TODOS LOS PRODUCTOS 
    // Y ELIMINARLOAS SI ES ASI



























    var formData = this.manageOrderForm.value;
    console.log("PRODUCT NAME ", formData.menu.name, " id_type_menu ", formData.menu.id, " Id_detail_sub_user ", this.id_detail, " Quantity ", formData.quantity," DETALLE",formData.detail);
    var data = {
      id_type_menu: formData.menu.id,
      id_detail_sub_user: this.id_detail,
      amount: parseInt(formData.quantity),
      note:formData.note
    }
    this.subUserService.addOrder(data).subscribe((response: any) => {

      this.ngxService.stop();
      this.snackbarService.openSnackBar(this.responseMessage, "Success");
      
      this.manageOrderForm.controls['note'].setValue('');
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstans.error);
    });
    /*var productName = this.dataSource.find((e: { id: number; }) => e.id == formData.menu.id);
    console.log("PRODUCT NAME ", formData.menu.id);
    if (productName == undefined) {
      this.totalAmount = this.totalAmount + this.dataSource.total;
      this.dataSource.push({
        id: formData.menu.id,
        name: formData.menu.name,
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total
      });
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackBar(GlobalConstans.productAdded, "Success");
      console.log("ID NO EXISTENTE ", this.dataSource);
    } else {
      //this.snackbarService.openSnackBar(GlobalConstans.productExistError, GlobalConstans.error);
      console.log("ID EXISTENTE ", productName);
    }*/

  }
  statusClickUser(value: any) {
    if (this.id_sub_user != null) {
      this.dato = localStorage.getItem('perfil');
      this.perfil_id = JSON.parse(this.dato);
      var datas = {
        id_sub_user: value,
        id_admin: this.perfil_id[0].id
      }
      this.subUserService.getStatus(datas).subscribe((response: any) => {
        var data = {
          id_detail_sub_user: response.id_detail,
          id_sub_user: parseInt(this.id_sub_user),
          id_admin: this.perfil_id[0].id,
          status:"pendiente"
        }
        this.status_btn = response.valor;
        this.id_detail = response.id_detail;
        this.getOrderSubUser(data);
        console.log("Hola desde aqui ", this.status_btn, " id_detail ", this.id_detail);
        if (response.valor === 0) {
          this.variable_btn = false;
          this.statusClienteTxt = "Agregar Cliente";
        } else {
          this.variable_btn = true;
          this.statusClienteTxt = "Cliente Agregado"

        }
      })
    }

  }
  addDetail() {
    //console.log("ID_SUB USER",this.id_sub_user);
    this.dato = localStorage.getItem('perfil');
    this.perfil_id = JSON.parse(this.dato);
    var data = {
      id_sub_user: this.id_sub_user,
      id_admin: this.perfil_id[0].id
    }
    this.subUserService.addDetail(data).subscribe((response: any) => {
      this.variable_btn = true;
      this.status_btn = 1;
      //this.status_btn===0
      this.validateProductAdd();
      this.ngxService.stop();
      this.statusClickUser(this.id_sub_user);
      this.snackbarService.openSnackBar(this.responseMessage, "Success");
      console.log("")



    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstans.error);
    })
  }
  getOrderSubUser(data: any) {

    console.log("Get order ", data);

    this.subUserService.getOrders(data).subscribe((response: any) => {
      this.dataSource = response;
      console.log("TOTAL  ", this.dataSource);
      // this.totalAmount = this.totalAmount + this.dataSource.total;
      this.dataSource.forEach((element: any) => {
        this.totalAmount = this.totalAmount + (element.price*element.quantity);

      });

      this.totalAmount = Number(this.totalAmount.toFixed(2));
      console.log(this.totalAmount)
    })
  }
  handleDeleteAction(value: any, element: any) {
    //this.totalAmount=0
    this.totalAmount = Number(this.totalAmount.toFixed(2));
    element.total = Number(element.total.toFixed(2));
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);

    this.dataSource = [...this.dataSource];
    console.log(element.id)
    this.subUserService.delete(element.id).subscribe((response: any) => {
      this.ngxService.stop();
      // this.statusClickUser(this.id_sub_user);










      //this.snackbarService.openSnackBar(this.responseMessage, "Success");
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
  handleAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(CustomerComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCustomer.subscribe((response) => {
      this.getSubUsers();
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  submitAction() {
    //this.totalAmount=0;
    this.dato = localStorage.getItem("perfil");
    this.perfil = JSON.parse(this.dato);
    console.log("PROFILE ",this.perfil);
    this.ngxService.start();


    var formData = this.manageOrderForm.value;
    var data = {
      phone: this.perfil[0].phone,
      name_rest: this.perfil[0].name_rest.toUpperCase(),
      location:this.perfil[0].location.toUpperCase(),
      name: formData.name.toUpperCase(),
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource)
    }
    this.billService.generateReport(data).subscribe((response: any) => {
      saveAs(response, this.perfil[0].user + '.pdf');
      this.ngxService.stop();
      this.updateStatusDeliveries(formData.paymentMethod);
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
  updateStatusDeliveries(paymethod:any) {
    //this.orderService.update()
    var dato={
      id:this.id_detail,
      status:"entregado",
      paymentMethod:paymethod

    }
    this.orderService.update(dato).subscribe((response)=>{
      
      this.responseMessage = "Se actualizo correctamente";
      this.snackbarService.openSnackBar(this.responseMessage,"Success");
    })
    console.log("ID_DETAIL ",this.id_detail);
    this.getSubUserById(null);
    
  }
  downloadFile(fileName: any) {
    /*var data = {
      uuid:fileName
    }
    this.billService.getPDF(data).subscribe((response:any)=>{
      saveAs(response,fileName+'.pdf');
      this.ngxService.stop();
    })
  }*/
  }
}

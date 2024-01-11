import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NgxQrcodeStylingComponent, NgxQrcodeStylingModule, NgxQrcodeStylingService, Options } from 'ngx-qrcode-styling';
import { ProfileComponent } from '../dialog/profile/profile.component';
import { Route, Router } from '@angular/router';
import { MenuComponent } from '../dialog/menu/menu.component';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstans } from 'src/app/shared/global-constans';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import html2canvas from 'html2canvas';
import * as saveAs from 'file-saver';
@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.scss']
})
export class ManageProfileComponent implements OnInit {
 // @ViewChild('qrcode', { static: false }) public qrcode!: NgxQrcodeStylingComponent;
 
 isButtonSelected_qr: boolean = false;
 isButtonSelected_img:boolean=false;
 btn_slect_qr=0;
 btn_slect_img=0;



  dato: any
  perfilS: any
  perfil: any
  displayedColumns: any;
  dataSource: any = [];
  formGroup: any = FormGroup;
  Uui?: string = "ff";
  imgUrl: any;
  qrImgUrl: any;

  image: any;
  imageQr:any;

  responseMessage: any;
  
  onEmitChangeProfil = new EventEmitter();
  //config:any;
  onSubmitForm() { }
  applyFilter(event: any) { }
  verDetalle(element: any) { }
  constructor(private dialog: MatDialog, private route: Router,
    private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private sanackService: SnackbarService,
    private router:Router,
    private testDI: NgxQrcodeStylingService) {
    //console.log("datossss",this.dato['id']);
    this.dato = localStorage.getItem("perfil");
    this.perfil = JSON.parse(this.dato);
    //this.perfil = this.perfilS[0];

    //this.perfil = this.perfil[0]; //las listas empiezan desde `0`
    console.log("ARRARY", this.perfil);
  }
  ngOnInit(): void {
    this.Uui = this.perfil[0].ui


    this.get_profile_admin(this.perfil[0].id);
    
    //this.imgUrl = "http://localhost/api_restaurant/uploads/jfniganez@gmail.com/restaurante.jpg";
    console.log("PRofile admin" + this.dataSource);
  }
  

  get_profile_admin(id: any) {
    var data = {
      id: id,
    }
    this.userService.get_all(data).subscribe((response: any) => {

      this.dataSource = response;
      console.log("PROFILE ", this.dataSource);
      this.imgUrl = "http://localhost/api_restaurant/uploads/" + this.dataSource[0].logo;
      //this.qrImgUrl = "http://localhost/api_restaurant/uploads/" + this.dataSource[0].logo_qr;
      if(this.dataSource[0].logo_qr == ""){
        this.qrImgUrl = "../../../assets/img/qr.png";
      }else{
        this.qrImgUrl = "http://localhost/api_restaurant/uploads/" + this.dataSource[0].logo_qr;
      }
      console.log("QR IMG "+this.qrImgUrl)

    }, (error: any) => {

      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstans.genericError;
      }
      this.sanackService.openSnackBar(this.responseMessage, GlobalConstans.error);
    })
  }
  
    public config: Options = {
      width: 250,
      height: 250,
      margin: 5,
      dotsOptions: {
        color: "#000",
        type: "square"
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 0
      }
    };
  
 

 
  handleQrAmin(){
    this.ngxService.start();
    var data = {
      name_rest:this.dataSource[0].name_rest.toUpperCase(),
      email:this.dataSource[0].user,
      phone:this.dataSource[0].phone,
      location:"por ahi",
      ui:this.dataSource[0].ui,
      logo:this.dataSource[0].logo
    }
    console.log("DATA ",data)
    this.userService.generatePDF_QR_ADMIN(data).subscribe((response:any)=>{
      this.ngxService.stop();
      
      this.responseMessage = "Se descargo correctamente";
      this.sanackService.openSnackBar(this.responseMessage,"Success");
      saveAs(response, this.perfil[0].user + '.pdf');
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstans.genericError;
      }
      this.sanackService.openSnackBar(this.responseMessage,GlobalConstans.error);
    });
  }
  funciona() {
    return this.dataSource[0].ui;

  }
  handleEditAction(value: any) {
    console.log("HNDLE EDIT ", value)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: value
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ProfileComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitChangeProfile.subscribe((response) => {
      this.get_profile_admin(this.perfil[0].id);
    })
    this.route.events.subscribe(() => {
      dialogRef.close();
    })
  }
  selectImage(event: any, type: any) {
    
 
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      if (type == 'imgUrl') {
        this.imgUrl = event.target?.result;
        this.btn_slect_img=1;
        this.isButtonSelected_img=true;
      } else {
        if (type == 'qrImgUrl') {
          this.qrImgUrl = event.target?.result;
          this.btn_slect_qr=1;
          this.isButtonSelected_qr=true;
        }
      }

    }
    if (type == 'imgUrl') {
      this.btn_slect_img=1;
      this.image = file;
    } else {
      if (type == 'qrImgUrl') {
        this.btn_slect_qr=1;
        this.imageQr = file;
      }
    }
    //this.image = file;
    console.log(file)
  }
  validateSubmit_qr() {

    if(this.btn_slect_qr===0){
      return true;
    }else{
      return false;
    }


  }
  validateSubmit_img() {

    if(this.btn_slect_img===0){
      return true;
    }else{
      return false;
    }


  }
  handleSubmitQr() {
   // console.log("QR ", this.imageQr);
   // this.sendImg(this.image);
   this.ngxService.start();
   let name_img_qr = Date.now()+'.jpg';
   this.sendImg(this.imageQr,"logo_qr",this.dataSource[0].logo_qr,name_img_qr);
   this.btn_slect_qr=0;
   this.isButtonSelected_qr=false;
   console.log(name_img_qr);
  }
  handleSubmitImg() {
    this.ngxService.start();
    let name_img = Date.now()+'.jpg';
    //console.log("IMG ", this.image);
    this.btn_slect_img=0;
    this.isButtonSelected_img=false;
    this.sendImg(this.image,"logo",this.dataSource[0].logo,name_img);
  //  const frData = new FormData();
    
  }
  sendImg(img:any,type:any,img_logo_delete:any,name_img:any) {

    const frData = new FormData();
    frData.append('image', img);
    frData.append('image', this.dataSource[0].user);
    frData.append('name_img',name_img);
    
    
    var data={
      id:this.dataSource[0].id,
      logo_delete:img_logo_delete,
      email:this.dataSource[0].user,
      name_img:name_img,
      type_img:type
    }
    this.userService.update_img(data).subscribe(
      {
        next:(response:any)=>{
          this.ngxService.stop();
          this.responseMessage = response?.message;
          this.sanackService.openSnackBar(this.responseMessage,"");
          this.userService.upload_image(frData).subscribe();
          
         // this.get_profile_admin(this.perfil[0].id);
          
        },
        error:error=>{
          this.ngxService.stop();
          if(error.error?.message){
            this.responseMessage = error.error?.message;
          }else{
            this.responseMessage = GlobalConstans.genericError;
          }
          this.sanackService.openSnackBar(this.responseMessage,GlobalConstans.error);
        }});

  }

}

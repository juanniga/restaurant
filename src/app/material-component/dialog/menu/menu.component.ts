import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { MenuService } from 'src/app/services/menu.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstans } from 'src/app/shared/global-constans';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  onAddMenu = new EventEmitter();
  onEditMenu = new EventEmitter();
  menuForm:any=FormGroup;
  
  dialogAction:any="Add";
  action:any="Agregar";
  responseMessage:any;
  category:any=[];

  dato:any;
  perfil_id:any;
  val_image=false;
  imgUrl='../../assets/img/restaurant.png';
  image='';
  src='http://localhost/api_restaurant/apis/';
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private menuService:MenuService,
  public dialogRef:MatDialogRef<MenuComponent>,
  private categoryService:CategoryService,
  public snackBarService:SnackbarService) { }

  ngOnInit(): void {
    this.menuForm = this.formBuilder.group({
      image:[null],
      name:[null,[Validators.required]],
      price:[null,[Validators.required]],
      discount:[0,Validators.pattern(GlobalConstans.number)],
      description:[null,[Validators.required]],
      categoryId:[null,[Validators.required]]      
    })
    if(this.dialogData.action === 'Editar'){
      
      this.val_image=true;
      
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      this.menuForm.patchValue(this.dialogData.data);
     
    }
    this.getCategorys();
    //var formData =this.menuForm.value;
   // console.log(formData.image);
      var formData =this.menuForm.value;
      if(formData.image != null){
        this.imgUrl = 'http://localhost/api_restaurant/uploads/'+formData.image;
      //  console.log("************",formData.image);
      }else{
       // this.imgUrl=this.image;
      }
      console.log("HOLA DESDE MENU ",this.dialogData.data)
  }
  
  getCategorys(){
    this.categoryService.getCategorys().subscribe((response:any)=>{
      this.category = response;
    //  console.log("CATEGORIAS ",this.category)
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstans.error);
    })
  }
  handleSubmit(){
    if(this.dialogAction === 'Edit' ){
      this.val_image=true;
      //console.log("************/////",this.val_image);
      this.edit();
    }else{
      this.val_image=false;
     // console.log("************/////",this.val_image);
      this.add();
    }
  }
  edit(){
    let name_img = Date.now()+'.png';
    this.dato=localStorage.getItem('perfil');
		this.perfil_id = JSON.parse(this.dato);
    var formData =this.menuForm.value;
    if(this.image){
      var data = {
        id:this.dialogData.data.id,
        id_categ:formData.categoryId,
        image : this.perfil_id[0].user,
        name:formData.name,
        price:formData.price,
        discount:formData.discount,
        description:formData.description,
        logo_delete:this.dialogData.data.image,
        name_img:name_img
  
      }
    }else{
      let imagenes = this.dialogData.data.image.split('/');
      var data = {
        id:this.dialogData.data.id,
        id_categ:formData.categoryId,
        image : this.perfil_id[0].user,
        name:formData.name,
        price:formData.price,
        discount:formData.discount,
        description:formData.description,
        logo_delete:this.dialogData,
        name_img:imagenes[1]+"",
  
      }
    }
    /*
    let imagenes = this.dialogData.data.image.split('/');
    console.log("IMAGENES ",imagenes[0]);
    console.log("IMAGENES ",imagenes[1]);

    if(this.image){
      console.log("indefinido",)
    }else{
      console.log(" no indefinido",this.image)
    } */
    
    
    let frData = new FormData();
    frData.append('image',this.image);
    frData.append('image',this.perfil_id[0].user);
    frData.append('name_img',name_img);
    console.log(data);

    
    this.menuService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      
      this.responseMessage = response.message;
      this.snackBarService.openSnackBar(this.responseMessage,"Success");
      
      
      if(this.image){
        this.menuService.upload_image(frData).subscribe();
      }
      this.onEditMenu.emit(this.imgUrl);
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstans.error);
    });
  }
  add(){
    let name_img = Date.now()+'.png';
    this.val_image=false;
    console.log(this.val_image);
    this.dato=localStorage.getItem('perfil');
		this.perfil_id = JSON.parse(this.dato);
    var formData =this.menuForm.value;
    var data = {
      id_user_ad:this.perfil_id[0].id,
      image : this.perfil_id[0].user,
      name : formData.name,
      id_categ:formData.categoryId,
      price:formData.price,
      discount:formData.discount+"",
      description:formData.description,
      name_img:name_img

    }
    console.log("DATA SEND ",data)
   // const url_image = this.perfil_id[0].user.split('.');
    let frData = new FormData();
    frData.append('image',this.image);
    frData.append('image',this.perfil_id[0].user);
    frData.append('name_img',name_img);
    this.menuService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      
      this.responseMessage = response.message;
      this.snackBarService.openSnackBar(this.responseMessage,"success");
      this.menuService.upload_image(frData).subscribe();
      this.onAddMenu.emit();
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstans.error);
    });
    
  }
  selectImage(event:any){
    
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event:any)=>{
      if(event){
        console.log("si")
      }else{
        console.log("no")
      }
      this.imgUrl = event.target?.result;
    }
    this.image = file;
    console.log("IMAGEN ",this.imgUrl)
  }

}

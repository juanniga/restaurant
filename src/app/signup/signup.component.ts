import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstans } from '../shared/global-constans';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm:any = UntypedFormGroup;
  responseMessage:any;
  imgUrl='../../assets/img/restaurant.png';
  image='';
  constructor(private formBuilder:UntypedFormBuilder,
    private router:Router,
    private userService:UserService,
    private snackBar:SnackbarService,
    private dialogRef:MatDialogRef<SignupComponent>,
    private ngxService:NgxUiLoaderService,
    private _bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name_rest:[null,[Validators.required]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstans.emailRegex)]],
      password:[null,[Validators.required]],
      location:[null,[Validators.required]],
      //logo:email+,
      
      specialty:[null,[Validators.required]],
    })
  }
  handleSubmit(){
    let name_img = Date.now()+'.jpg';
    this.ngxService.start();
    var formData = this.signupForm.value;
    
    var data = {
      name_rest:formData.name_rest,
      user:formData.email,
      password:formData.password,
      location:formData.location,
      logo:"formData.email",
      name_img:name_img,
      //file:formData.logo,
     // file:formData.append('file',this.image),
      specialty:formData.specialty,
      
      //file:formData.append('file',this.image)
    }

    const frData = new FormData();
   //frData.append('file',this.image);
   frData.append('image',this.image);
   frData.append('image',formData.email);
   frData.append('name_img',name_img);
  
    
    this.userService.signup(data).subscribe(
      {
      next:response=>{
        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = response.toString;
        this.snackBar.openSnackBar(this.responseMessage,"");
        this.router.navigate(['/']);
      },
      error:error=>{
        this.ngxService.stop();
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }else{
          this.responseMessage = GlobalConstans.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage,GlobalConstans.error);
      }});
      
   
    /*this.userService.signup(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackBar.openSnackBar(this.responseMessage,"");
      this.router.navigate(['/']);
    },(error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackBar.openSnackBar(this.responseMessage,GlobalConstans.error);
    }); */
    this.userService.upload_image(frData).subscribe();
  }
  openBottomSheet(): void {
    //this._bottomSheet.open();
  }
  selectImage(event:any){
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event:any)=>{
      this.imgUrl = event.target?.result;
    }
    this.image = file;
    console.log(file)
  }

}

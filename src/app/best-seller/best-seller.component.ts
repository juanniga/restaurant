import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstans } from '../shared/global-constans';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.scss']
})
export class BestSellerComponent implements OnInit {
  loginForm:any = FormGroup;
  responseMessage:any;
  datos:any;
  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private userService:UserService,
    //private dialogRef:MatDialogRef<LoginComponent>,
    private ngxService:NgxUiLoaderService,
    private snackService:SnackbarService,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstans.emailRegex)]],
      password:[null,[Validators.required]]
    });
  }
  handleSubmit(){
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data ={
      user:formData.email,
      password:formData.password
    }
    this.userService.login(data).subscribe((response:any)=>{
      
      this.ngxService.stop();
     // this.dialogRef.close();
      localStorage.setItem('token',response.token);
   //   this.datos=JSON.stringify({response.results});
      localStorage.setItem('perfil',JSON.stringify(response.results));
      console.log("desde login ",JSON.stringify(response.results));
      this.router.navigate(['/restaurant/dashboard']);
    },(error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackService.openSnackBar(this.responseMessage,GlobalConstans.error);
    })
  }
  signupAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(SignupComponent,dialogConfig)
  }
}

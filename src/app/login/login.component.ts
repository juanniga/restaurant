import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstans } from '../shared/global-constans';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:any = FormGroup;
  responseMessage:any;
  datos:any;
  constructor(private formBuilder:UntypedFormBuilder,
    private router:Router,
    private userService:UserService,
    private dialogRef:MatDialogRef<LoginComponent>,
    private ngxService:NgxUiLoaderService,
    private snackService:SnackbarService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstans.emailRegex)]],
      password:[null,[Validators.required]]
    });
    //console.log(this.userService.getUserLogged())
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
      this.dialogRef.close();
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

}

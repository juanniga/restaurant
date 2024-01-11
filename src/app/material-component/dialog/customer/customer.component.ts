import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SubUserService } from 'src/app/services/sub-user.service';
import { GlobalConstans } from 'src/app/shared/global-constans';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customerForm:any=FormGroup;
  onAddCustomer = new EventEmitter();
  responseMessage:any;
  constructor(
    private formBuilder:FormBuilder,
    private subUserService:SubUserService,
    public dialogRef:MatDialogRef<CustomerComponent>,
    public snackBarService:SnackbarService
  ){}
  ngOnInit(){
    this.customerForm = this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstans.emailRegex)]],
      name:[null,[Validators.required,Validators.pattern(GlobalConstans.nameRegex)]],
      contactNumber:[null]
    })
  }
  handleSubmit(){
    var formData = this.customerForm.value;
    var data = {
      email:formData.email,
      name:formData.name,
      phone:formData.contactNumber
    }
    this.subUserService.addCustomer(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddCustomer.emit();
      this.responseMessage = response.message;
      this.snackBarService.openSnackBar(this.responseMessage,"Success");
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


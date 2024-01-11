import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstans } from 'src/app/shared/global-constans';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm:any=FormGroup;
  imgUrl:any;
  responseMessage:any;
  onEmitChangeProfile = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
      private formBuilder:FormBuilder,
      private userService:UserService,
      private snackBarService:SnackbarService,
      public dialogRef:MatDialogRef<ProfileComponent>,){}
  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      name_rest:[null,[Validators.required,Validators.pattern(GlobalConstans.nameRegex)]],
      location:[null,[Validators.required,Validators.pattern(GlobalConstans.nameRegex)]],
      specialty:[null,[Validators.required,Validators.pattern(GlobalConstans.nameRegex)]],
      phone:[null,[Validators.required,Validators.pattern(GlobalConstans.contactNumberRegex)]],
      start_t:[null],
      end_t:[null]
    }) ;
    
    this.profileForm.patchValue(this.dialogData.data[0]);
    this.imgUrl="http://localhost/api_restaurant/uploads/"+this.dialogData.data[0].logo
    console.log("DATA DESDE DIALOG ",this.dialogData.data[0].id);
   // var formData =this.profileForm.value;
  }
  handleSubmit(){
    var formData =this.profileForm.value;
    var data = {
      id:this.dialogData.data[0].id,
      name_rest:formData.name_rest,
      location:formData.location,
      specialty:formData.specialty,
      phone:formData.phone,
      start_t : formData.start_t,
      end_t: formData.end_t,

    }
    this.userService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.responseMessage = response.message;
      this.snackBarService.openSnackBar(this.responseMessage,"Success");
      this.onEmitChangeProfile.emit();
      //this.update_data_profile(this.dialogData.data[0].id);
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstans.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstans.error);
    })
    //console.log("hora inicio ",formData.start_t," hora fin ",formData.end_t)
  }
  update_data_profile(id: any) {
    this.userService.get_all(id).subscribe((response:any)=>{
     //localStorage.setItem('perfil',JSON.stringify(response.results));
     console.log("profile ",response)
    })
  }
  selectImage(event:any){
    
  }

}

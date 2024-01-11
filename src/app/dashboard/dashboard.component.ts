import { Component, AfterViewInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DashboardService } from '../services/dashboard.service';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstans } from '../shared/global-constans';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	responseMessage:any;
	data:any;
	currentUser: any;
	da:any;
	dato:any;
	perfil_id:any;
	ngAfterViewInit() { }

	constructor(private dasboardService:DashboardService,
		private ngxService:NgxUiLoaderService,
		private snackbarService:SnackbarService) {
			this.ngxService.start();
			this.dashboardData();
	}
	dashboardData(){
		//this.currentUser = localStorage.getItem("perfil");
		//this.da = JSON.parse(this.currentUser);
		//console.log("**************",(this.currentUser));
	


		this.dato=localStorage.getItem('perfil');
		this.perfil_id = JSON.parse(this.dato);
		//console.log("///",this.perfil_id[0].id);


		var datas = {
			id_user_ad:this.perfil_id[0].id,
			id_admin:this.perfil_id[0].id
			}
	//	console.log("DATA ",datas);
		this.dasboardService.getDetails(datas).subscribe((response:any)=>{
			this.ngxService.stop();
			this.data = response;
		},(error:any)=>{
			this.ngxService.stop();
			console.log(error);
			if(error.error?.message){
				this.responseMessage = error.error.message;
			}else{
				this.responseMessage = GlobalConstans.genericError;
			}
			this.snackbarService.openSnackBar(this.responseMessage,GlobalConstans.error);
		})
	}
}

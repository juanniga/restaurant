import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { environment } from 'src/environments/environment';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;
  
  constructor(private httpClient:HttpClient) { }
  signup(data:any){
    console.log("data ---",data)
    return this.httpClient.post(this.url+"/user/signup",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    });
  }
  upload_image(data:any){
    
    return this.httpClient.post(this.url+"/user/image-upload",data);
  }
  login(data:any){
    return this.httpClient.post(this.url+"/user/login/",data);
  }
  

  checkToken(){
    return this.httpClient.get(this.url+"/user/checkToken");
  }
  changePassword(data:any){
    return this.httpClient.post(this.url+"/user/changePassword",data,{
      headers:new HttpHeaders().set('Content-type',"application/json")
    })
  }
  update(data:any){
    return this.httpClient.patch(this.url+"/user/update_admin/",data);
  }
  get_all(data:any){
    return this.httpClient.post(this.url+"/user/getall",data,{
      headers:new HttpHeaders().set('Content-type',"application/json")
    })
  }
  update_img(data:any){
    return this.httpClient.patch(this.url+"/user/update_img/",data);
  }
  generatePDF_QR_ADMIN(data:any):Observable<Blob>{
    return this.httpClient.post(this.url+"/bill/getPdfQR",data,{
      responseType:'blob'
    });
  }

}

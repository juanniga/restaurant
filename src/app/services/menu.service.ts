import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }
  add(data:any){
    return this.httpClient.post(this.url+"/menu/add",data,{
      headers:new HttpHeaders().set('content-Type',"application/json")
    })
  }
  update(data:any){
    return this.httpClient.patch(this.url+"/menu/update/",data,{
      headers:new HttpHeaders().set('content-Type',"application/json")
    })
  }
  getMenus(data:any){
    return this.httpClient.post(this.url+"/menu/get/",data);
  }
  delete(data:any){
    return this.httpClient.post(this.url+"/menu/delete/",data);
  }
  getMenuByCategory(data:any){
    return this.httpClient.post(this.url+"/menu/getByCategory",data);
   
  }
  getById(data:any){
    return this.httpClient.post(this.url+"/menu/getById",data);
  }
  upload_image(data:any){
    
    return this.httpClient.post(this.url+"/menu/image-upload",data);
  }
  updateStatus(data:any){
    return this.httpClient.patch(this.url+"/menu/updateStatus/",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    });
  }
}

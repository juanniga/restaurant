import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubUserService {

  url = environment.apiUrl;
  constructor(private httpClient:HttpClient) { }
  getSubUsers(){
    return this.httpClient.get(this.url+"/subUser/get/");
  }
  getById(data:any){
    return this.httpClient.get(this.url+"/subUser/getById/"+data);
  }
  getStatus(data:any){
    return this.httpClient.post(this.url+"/subUser/subStatus/",data);
  }
  addDetail(data:any){
    return this.httpClient.post(this.url+"/subUser/addDetail/",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    });
  }
  addCustomer(data:any){
    return this.httpClient.post(this.url+"/subUser/addSubUser",data);
  }
  getOrders(data:any){
    return this.httpClient.post(this.url+"/order/get",data);
  }
  addOrder(data:any){
    return this.httpClient.post(this.url+"/order/add",data);
  }
  getOverall(data:any){
    return this.httpClient.get(this.url+"/order/getOverall/"+data,{
      headers:new HttpHeaders().set('ContentType',"application/json")
    });
  }
  delete(data:any){
    return this.httpClient.delete(this.url+"/order/delete/"+data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    });
  }
  
}

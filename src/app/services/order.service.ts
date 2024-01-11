import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderList!:AngularFireList<any>;
  url = environment.apiUrl;
  constructor(private firedatabase:AngularFireDatabase,
    private httpClient:HttpClient) { }
  getOrderCustomers($key:string){
    //console.log("======="+this.orderList
    return this.orderList = this.firedatabase.list('orden/'+$key+'/');
  }
  removeCustomer($key:string){
    return this.orderList.remove($key);
  }
  getOrderSubUser(data:any){
    return this.httpClient.post(this.url+"/order/getSubUsers/",data);
  }
  update(data:any){
    return this.httpClient.patch(this.url+"/subUser/updateDetail/",data);
  }
  getDeliveries(data:any){
    return this.httpClient.post(this.url+"/order/getOrderDeliveries",data);
  }
  getDeliveriesDate(data:any){
    return this.httpClient.post(this.url+"/order/getOrderDate",data);
  }
  delete(id:any){
    return this.httpClient.delete(this.url+"/subUser/delete/"+id,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    });
  }
  deleteOrder($key:string){
    this.orderList.remove($key);
    //this.orderList.remove(order.$key);
   
  }
  
}



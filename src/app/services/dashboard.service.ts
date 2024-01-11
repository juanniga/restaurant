import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = environment.apiUrl;
  constructor(private httpClient:HttpClient) { }
  getDetails(data:any){
   
   // return this.httpClient.get(this.url+"/dashboard/details/",data,{});
    return this.httpClient.post(this.url+"/dashboard/details/",data);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }
  getCategorys(){
    return this.httpClient.get(this.url+"/category/get/");
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient:HttpClient) { }
  postApi(url:any,payload:any):Observable<any>{
     return this.httpClient.post(url,payload)
  }
  getApi(url:any):Observable<any>{
    return this.httpClient.get(url)
 }
}

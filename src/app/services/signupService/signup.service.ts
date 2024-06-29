import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http:HttpClient) { }
  header = new HttpHeaders({
    'Content-Type':'application/json',
    // 'api_key':''
    
  })
signUp(data:any){
  return this.http.post(`${environment.apiUrl}/signup`,data,{headers:this.header});
}
signUpStatus(id:String){
  return this.http.get(`${environment.apiUrl}/signup/status/${id}`,{headers:this.header});
}
getSignUpData(){
  return this.http.get(`${environment.apiUrl}/signup`,{withCredentials:true,headers:this.header});
}
actionLandlordData(data:any){
  return this.http.post(`${environment.apiUrl}/landlord/action/${data.id}`,data,{withCredentials:true,headers:this.header});
}

sendSubMail(data:any){
  return this.http.post(`${environment.apiUrl}/email-subscribe`,data,{headers:this.header});
}

}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'

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
  return this.http.post('https://rnmrs.onrender.com/signup',data,{headers:this.header});
}
signUpStatus(id:String){
  return this.http.get(`https://rnmrs.onrender.com/signup/status/${id}`,{headers:this.header});
}
getSignUpData(){
  return this.http.get(`https://rnmrs.onrender.com/signup`,{withCredentials:true,headers:this.header});
}
actionLandlordData(data:any){
  return this.http.post(`https://rnmrs.onrender.com/landlord/action/${data.id}`,data,{withCredentials:true,headers:this.header});
}

sendSubMail(data:any){
  return this.http.post(`https://rnmrs.onrender.com/email-subscribe`,data,{headers:this.header});
}

}

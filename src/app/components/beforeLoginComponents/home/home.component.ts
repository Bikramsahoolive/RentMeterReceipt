import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SignupService } from 'src/app/services/signupService/signup.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private toster:ToastrService,
    private homeServ :SignupService,
  ){}

  sendSubMail(emailId:any){

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(emailId.value)){
      this.toster.error('Invalid Email Input','Frontend');
      return;
    }
    this.homeServ.sendSubMail({email:emailId.value}).subscribe({
      next:(res:any)=>{
        if(res.status ==='success'){
          this.toster.success("Email Subscribed Successfully.");
        }else{
          this.toster.error('Something Went wrong.');
        }
      },error:(err)=>{
        console.error(err);
        this.toster.error('Something Went wrong.');
        
      },complete:()=>{
        emailId.value = '';
      }
    })
      
    



  }
}

import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LandlordService } from 'src/app/services/landlordService/landlord.service';

@Component({
  selector: 'app-bill-payment',
  templateUrl: './bill-payment.component.html',
  styleUrls: ['./bill-payment.component.css']
})
export class BillPaymentComponent {
  constructor(private router:Router,private landlordServe :LandlordService,private spinner:NgxSpinnerService,private toastr:ToastrService){}
  currentDate:any;
  toPaidAmount:number=0;
  payableAmount:any;
  ngOnInit(){
    this.currentDate = this.createDate();
  }

  createDate(){
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth()+1).toString().padStart(2,"0");
    const day = date.getDate().toString().padStart(2,"0");
    return `${year}-${month}-${day}`;
  }

  dateFormater(date:any){

    let dateData =new Date(date);
    let year = dateData.getFullYear();
    let month =(dateData.getMonth()+1).toString().padStart(2,'0');
    let day = dateData.getDate().toString().padStart(2,'0');
    return `${day}-${month}-${year}`;
  }

  billPayment(form:NgForm){
    
    let data = form.value;
    let reDate = this.dateFormater(data.payment_date);
    data.payment_date = reDate;
    let id = data.id;
    if(data.id===null || data.id==="" || data.paid===""){
      this.toastr.info('Invalid Bill ID and Paid Amount.','',{positionClass:"toast-top-center",progressBar:true});
      return;
    }
    if(data.paid_amt>this.toPaidAmount || data.paid_amt === 0 || data.paid_amt ===null){
      this.toastr.info('Invalid paid amount','',{positionClass:"toast-top-center",progressBar:true});
      
    }else{
      data.payment_method = "CASH";
      this.spinner.show();
this.landlordServe.paymentBillData(data,id).subscribe({
  next:(res:any)=>{
    this.toastr.success(res.message,'Success',{positionClass:"toast-top-center",progressBar:true});
    form.reset();
    this.currentDate = this.createDate();
    this.router.navigate([`print-rent-bill/${id}`]);
  },
  error:(err)=>{
    console.log(err.error);
    if(err.error.status==='failure'){
      this.toastr.error(err.error.message,'Error',{positionClass:"toast-top-center",progressBar:true});
    }else{
      this.toastr.error('Something Wents wrong.','Error',{positionClass:"toast-top-center",progressBar:true});
    }
    this.spinner.hide();
  }
});

    }
    
    
  }


  getPaymentAmount(id:any){

    let encData = localStorage.getItem('connect.sid');
    let userData:any;
    if(encData){
     userData = JSON.parse(atob(encData));
    }
    if(id.value ==="" || (id.value).length<13){
      this.toastr.info('Invalid Bill ID','Error',{positionClass:"toast-top-center",progressBar:true});
    }else{
      this.spinner.show();
      this.landlordServe.getSingleRentBillData(id.value).subscribe({
        next:(res:any)=>{
          this.spinner.hide();
          if(res.landlord_id !== userData.id){
            this.toastr.error('Unauthorized Bill Access.','',{positionClass:"toast-top-center",progressBar:true});
            return;
          }
          
          if(res.final_amt == res.paid_amt){
            this.toastr.success('Bill Already Paid','',{positionClass:"toast-top-center",progressBar:true});
          }else{
            this.toPaidAmount = res.final_amt - res.paid_amt;
            this.payableAmount = res.final_amt - res.paid_amt;
          }
        },error:(error)=>{
          console.log(error);
          this.toastr.error('Bill ID is not exist.','Error',{positionClass:"toast-top-center",progressBar:true});
          this.spinner.hide();
        }
      })

    }
    
  }

}

import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import { landlordData, rentBillData } from 'src/app/model/data';
import { AuthServiceService } from 'src/app/services/auth Service/auth-service.service';
import { LandlordService } from 'src/app/services/landlordService/landlord.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-print-rent-bill',
  templateUrl: './print-rent-bill.component.html',
  styleUrls: ['./print-rent-bill.component.css']
})
export class PrintRentBillComponent {
  constructor( private route:ActivatedRoute, private landlordServ:LandlordService, private spinner:NgxSpinnerService, public authServe:AuthServiceService){}
paramId:any='';
bill:rentBillData={
  adjustUnit: 0,
  billingDate: '',
  bill_period:'',
  consumer_Name: '',
  currentUnit: 0,
  dueAmount: 0,
  dueDate: '',
  eBill: 0,
  electric_status: '',
  final_amt: 0,
  id: '',
  landlord_id: '',
  landlord_name: '',
  paid_amt: 0,
  payment_date: '',
  payment_method:'',
  perunit: 0,
  previousUnit: 0,
  rent: 0,
  rentholder_id: '',
  totalAmount: 0,
  totalUnit: 0,
  unitAdv: 0,
  water_bill: 0,
  maintenance:0
};
upiLink:any;
landlordSign:string="../../../../assets/images.png";
boxVal:string='';
paymentMethod:string='';
paidSign:string='';
showPayBtn:boolean=false;
  ngOnInit(){
    this.spinner.show();
      let urlid = this.route.snapshot.paramMap.get('id');
    this.landlordServ.getSingleRentBillData(urlid).subscribe({
      next:(res:rentBillData)=>{
        let remainingAmt = Number(res.final_amt ) - Number(res.paid_amt);
        if(remainingAmt != 0){
          this.showPayBtn = true;
          this.bill=res;
          this.landlordServ.getLandlordData(res.landlord_id).subscribe({
            next:(LanlordRes:landlordData)=>{
              if(res.id){
                
              this.upiLink=`upi://pay?pa=${LanlordRes.upi}&pn=${LanlordRes.name}&am=${remainingAmt}.00&cu=INR&tn=RNMR:${this.bill.id}`;
              if(!LanlordRes.signature || LanlordRes.signature===""){
                this.landlordSign = "../../../../assets/images.png";
              }else{
              this.landlordSign=LanlordRes.signature;
              }
              this.boxVal ='Scan To Pay!';
              }
            },
            error:(err)=>{
              console.log(err.error);
              
            },
            complete:()=>{
              this.spinner.hide();
            }
          });
        }else{
          this.paidSign='../../../../assets/background/paid.png';
          this.boxVal = ` Date : ${ res.payment_date}`;
          this.paymentMethod = `Mode : ${res.payment_method}`;
          this.bill=res;
          this.landlordServ.getLandlordData(res.landlord_id).subscribe({
            next:(LanlordRes:landlordData)=>{
              if(LanlordRes.id){
              this.landlordSign=LanlordRes.signature ? LanlordRes.signature:"../../../../assets/images.png";
              }
            },
            error:(err)=>{
              console.log(err.error);
              
            },
            complete:()=>{
              this.spinner.hide();
            }
          });
        }
       
      },
      error:(err)=>{
        console.log(err.error);
      }
    });
    
  }
  
  print(){
    window.print();
  }

  openUpi(){
    if(this.authServe.Rentholder()){
      Swal.fire({
        title:"Info",
        icon:"info",
        text:"Direct UPI payment through thirdparty website may give some error, Try scan and pay on UPI."
      })
      .then((result:any)=>{
        console.log(result);
        //isConfirmed
        //isDenied
        //value
        const upiBtn = document.createElement('a');
        upiBtn.href=this.upiLink;
        upiBtn.click();
      });
    }
  }
  payNow(){
Swal.fire({
  title:"Payment Gateway",
  text:"Additional 3% of convenience fee applied, Click on proceed to complete the payment.",
  icon:'info',
  showConfirmButton:true,
  confirmButtonText:"Proceed",
  showCancelButton:true,
})
.then((result)=>{
  if(result.isConfirmed){
    let amount = (+this.bill.final_amt)-(+this.bill.paid_amt);

    let order={
      amount: amount,
      currency:'INR',
      billid:this.bill.id
    }
      this.spinner.show();
      this.landlordServ.createOrder(order).subscribe({
        next:(res:any)=>{
          this.spinner.hide();
          res.name =this.bill.consumer_Name;
          res.description="test_payment";
          res.email="test@test.com";
          res.phone="9998887770";
          this.landlordServ.payWithRazorpay(res);
        },error:(err:any)=>{
          this.spinner.hide();
          console.error(err.error);
          
        }
      });

      }
    });
  }
}

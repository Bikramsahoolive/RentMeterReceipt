import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth Service/auth-service.service';
import { NetworkStatusService } from 'src/app/services/network-status-service/network-status.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @ViewChild('internetStatus')internetStatus!:ElementRef;
  @ViewChild('internetIcon')internetIcon!:ElementRef;
  @ViewChild('internetMsg')internetMsg!:ElementRef;

  constructor(public authService:AuthServiceService , private networkStatus:NetworkStatusService){}

  ngAfterViewInit(){
    this.networkStatus.onlineStatus.subscribe(isOnline=>{
      let timmer;
      if(isOnline===true){

        this.internetStatus.nativeElement.style.backgroundColor = "#0c791eba";
        this.internetIcon.nativeElement.innerHTML = 'wifi';
        this.internetMsg.nativeElement.innerHTML = "Back to online";
        timmer = setTimeout(()=>{
          this.internetStatus.nativeElement.classList.remove('internet-show');
        },3000);
      }else{
        clearTimeout(timmer);
        this.internetStatus.nativeElement.style.backgroundColor = "rgb(121 12 12 / 68%";
        this.internetStatus.nativeElement.classList.add('internet-show');
        this.internetIcon.nativeElement.innerHTML = 'wifi_off';
        this.internetMsg.nativeElement.innerHTML = "No internet connection";
        
      }
      
    })
  }

  deferredPrompt:any;
  showPopup:boolean=true;

  ngOnInit(){
    
    window.addEventListener('beforeinstallprompt',(event:any)=>{
      event.preventDefault();
      this.showPopup = false;
      this.deferredPrompt = event;
      const currentTime = String(Date.now());
      const setTime = localStorage.getItem('app-prompt')||'';
      if(currentTime >= setTime){

        setTimeout(()=>{

          Swal.fire({
            html:` <span> RentⓝMeter.Receipt in App Available ! Get best experience,and  enjoy faster access.<br><br>
            <strong>Install App Now</strong>
            </span>  `,
            showCloseButton:true,
            confirmButtonText:"Install",
            position:'top',
            allowOutsideClick:false
          })
          .then((res)=>{
            if(res.isConfirmed){
              this.deferredPrompt.prompt();
              localStorage.removeItem('app-prompt');
              this.deferredPrompt.userChoice.then((choiceResult:any)=>{
                if(choiceResult.outcome ==='accepted'){
                  console.log("app installed");
                  
                }else{
              const timeer = String(Date.now()+86400000);
              localStorage.setItem('app-prompt',timeer);
                }
              });
            }else{
              const timeer = String(Date.now()+86400000);
              localStorage.setItem('app-prompt',timeer);
            }
          });

        },60000);
      
    }
});

  const openApp = ()=>{
    
    localStorage.setItem('connect.rid',btoa('false'));
      this.authService.setHeader();
     
        const platform = /Android/i.test(navigator.userAgent)
        
        if( platform && this.showPopup && !window.matchMedia('(display-mode: standalone)').matches){
          Swal.fire({
            html:'<strong>Open RentⓝMeter.Receipt in App ?</strong>',
            position:'top',
            confirmButtonText:'Open App',
            showCancelButton:true,
            cancelButtonText:'Continue in Browser',
            allowOutsideClick:false
          })
          .then((res)=>{
            if(res.isConfirmed){
              let tag = document.createElement('a');
              tag.href = '/';
              tag.target = '_blank';
              tag.click();
              window.open('about:blank','_self');
            }
          })
        }
        }
        setTimeout(openApp,3000);

        



        
 }
  dropdownToggle(dropdown:any,tglBtn:any)
  {
    dropdown.classList.toggle('open');
    const isOpen = dropdown.classList.contains('open')

    tglBtn.classList = isOpen
            ? 'fa-solid fa-xmark'
            : 'fa-solid fa-bars'
  }
  hideMenu(dropdown:any,tglBtn:any){
    dropdown.classList='dropdown_menu';
    tglBtn.classList ='fa-solid fa-bars';
  }
  logout(){
    this.authService.logout();
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

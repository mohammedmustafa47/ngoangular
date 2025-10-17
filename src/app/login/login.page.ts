import { Component, OnInit } from '@angular/core';
import { Auth} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false,
})
export class LoginPage implements OnInit {
  loginobj= {
    "username":'',
    "password":''
  }
  showPassword = false;
  rememberMe = false;

  // auth: any;
  constructor(private http:HttpClient,private route:Router, private serviceapi:Auth) { }

  ngOnInit() {
  }

  // onLogin(){
  //   debugger;
  //   this.http.post("http://127.0.0.1:8000/authapi/auth_login",this.loginobj).subscribe((res:any)=>{
  //     if(res.result){
  //       alert("login success")
  //       this.route.navigateByUrl('home') 
  //     }else{
  //       alert(res.detail)
  //     }
  //   })
  // }

  // onLogin() {
    
  //   this.serviceapi.login(this.loginobj.username, this.loginobj.password).subscribe({
  //     next: (res: any) => {
  //       console.log('Response',res);
  //       if (res.access) {
  //         alert('Login successful!');
  //         const role = res.role;

  //         if (role == 'admin') this.route.navigate(['/admin']);
  //         else if (role === 'donor') this.route.navigate(['/donor']);
  //         else if (role === 'volunteer') this.route.navigate(['/volunteer']);
  //         // else this.route.navigate(['/home']);
  //       } else {
  //         alert(res.detail||'unexpected response');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Login failed:', err);
  //       alert('Invalid username or password');
  //     }
  //   });
  // }


//   onLogin() {
//   this.serviceapi.login(this.loginobj.username, this.loginobj.password).subscribe({
//     next: (res: any) => {
//       console.log('Response', res);
//       if (res.access) {
//         alert('Login successful!');
//         const role = res.user.role; // Access role from res.user.role
//         if (role === 'admin') this.route.navigate(['/admin']);
//         else if (role === 'donor') this.route.navigate(['/donor']);
//         else if (role === 'volunteer') this.route.navigate(['/volunteer']);
//         else this.route.navigate(['/home']);
//       } else {
//         alert(res.detail || 'unexpected response');
//       }
//     },
//     error: (err) => {
//       console.error('Login failed:', err);
//       alert('Invalid username or password');
//     }
//   });
// }

onLogin() {
  this.serviceapi.login(this.loginobj.username, this.loginobj.password).subscribe({
    next: (res: any) => {
      console.log('Response', res);
      if (res.access) {
        alert('Login successful!');
        const role = res.user.role; // Access role from res.user.role
        console.log('User role:', role); // Debug: Check the role value
        if (role === 'admin') this.route.navigate(['/tab-admin']);
        else if (role === 'donor') this.route.navigate(['/tab-donor']);
        else if (role === 'volunteer') this.route.navigate(['/tab-volunteer']);
        else this.route.navigate(['/home']);
      } else {
        alert(res.detail || 'unexpected response');
      }
    },
    error: (err) => {
      console.error('Login failed:', err);
      alert('Invalid username or password');
    }
  });
}

}

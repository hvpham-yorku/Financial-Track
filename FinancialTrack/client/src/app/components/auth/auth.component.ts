import { UserService } from './../../services/user.service';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { log } from 'console';

@Component({
  selector: 'app-auth',
  standalone : true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  username: string = "";
  password: string = "";
  errorMessage: string = "";

  constructor(private http: HttpClient, private router: Router, private userService:UserService) {}

  login() {
    this.userService.getProfile().subscribe({
      next: (res) => {
        if(res){
          console.log(res);
        }else{
          console.log("No response.");
        }
      }
    });
  //   this.http.post<{data: string | null, error: string | null}>('/auth/login', {
  //     username: this.username,
  //     password: this.password
  //   }).subscribe(response => {
  //     if(response.error) {
  //       console.log("Response: ", response);

  //       this.errorMessage = response.error;
  //     } else {
  //     localStorage.setItem('jwt_token' , response.data!);
  //     console.log("Login working")
  //     this.router.navigate(['/dashbaord'], { queryParams: { authenticated: true } });
  //     }
  // });
  }

  register() {
    this.http.post<{data: string | null, error: string | null}>('/auth/register' ,
      {
      username: this.username,
      password: this.password
    }).subscribe(response => {
      if(response.error) {
        this.errorMessage = response.error;
      } else {
        localStorage.setItem('jwt_token' , response.data!);
        this.router.navigate(['/dashboard']);
      }
    });
  }

}


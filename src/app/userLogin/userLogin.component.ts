import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService } from "../service/auth.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-Login',
  templateUrl: './userLogin.component.html',
  styleUrls: ['./userLogin.component.css']
})
export class UserLoginComponent {

  hide = true;
  constructor(private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private services: AuthService,
              private router: Router) {
    sessionStorage.clear();
  }

  LoginForm = this.formBuilder.group({
    userName: this.formBuilder.control('', Validators.required),
    password: this.formBuilder.control('', Validators.required),
  });

  ProceedLogin() {
    if (this.LoginForm.valid) {
      this.services.GetForLogin(this.LoginForm.value.userName).subscribe({
        next:(serverData)=>this.CompareInformation(serverData)
      });
    }
  }

  CompareInformation(serverData:any){
    if(serverData.length < 1) {
      this.toastr.error("Oops, wrong input");
      return;
    }
    else {
      for(let i = 0; i < serverData.length; i++){
        const userData = serverData[i];
        if(userData.name === this.LoginForm.value.userName && userData.password === this.LoginForm.value.password){
          if(userData.isActive === true) {
            sessionStorage.setItem('userName', userData.name);
            sessionStorage.setItem('userRole', userData.role);
            this.router.navigate(['']).then();
          }
          else {
            this.toastr.error("Oops, your account is not active now");
          }
          return;
        }
      }
      this.toastr.error("Oops, wrong input");
    }
  }
}

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
    username: this.formBuilder.control('', Validators.required),
    password: this.formBuilder.control('', Validators.required),
  });

  ProceedLogin() {
    if(this.LoginForm.valid) {
      this.services.GetForLogin(this.LoginForm.value).subscribe({
        next:(serverData)=>this.CompareInformation(serverData),
        error: (err) => this.toastr.error(err.error)
      });
    }
  }

  CompareInformation(serverData:any){
    sessionStorage.setItem('username', serverData.username);
    sessionStorage.setItem('role', serverData.role);
    this.router.navigate(['']).then();
  }
}

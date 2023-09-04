import { Router } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { AuthService } from "../service/auth.service";

@Component({
  selector: 'app-userAdd',
  templateUrl: './userAdd.component.html',
  styleUrls: ['./userAdd.component.css']
})
export class UserAddComponent implements OnInit {

  roleList:any;
  userAction:string = "User Is NOT Active";
  userActionLabelColor = "red";

  constructor(private formBuilder:FormBuilder,
              private toastr:ToastrService,
              private services:AuthService,
              private router:Router,
              private dialogRef:MatDialogRef<UserAddComponent>) {}

  registrationForm = this.formBuilder.group({
    username:this.formBuilder.control('', Validators.required),
    password:this.formBuilder.control('', Validators.required),
    e_mail:this.formBuilder.control('', Validators.compose([Validators.required, Validators.email])),
    role:this.formBuilder.control('', Validators.required),
    isActive:this.formBuilder.control(false, Validators.required)
  });

  ngOnInit(){
    this.services.GetAllRoles().subscribe(rolesFromDB => {
      this.roleList = rolesFromDB;
    });
  }

  UserAction(){
    if(this.registrationForm.value.isActive === true){
      this.userAction = "User Is Active";
      this.userActionLabelColor = "green";
    }
    else {
      this.userAction = "User Is NOT Active";
      this.userActionLabelColor = "red";
    }
  }

  UserAccount(event:any){
    if(event.submitter.name === "AddUser"){
      this.RegistrationProcedure();
    }
  }

  RegistrationProcedure(){
    if(this.registrationForm.valid){
      this.services.RegistrationProcedure(this.registrationForm.value).subscribe({
        next:(result:any) => {
          this.toastr.success("You added user " + this.registrationForm.value.username, result);
          this.dialogRef.close();
        },
        error:(err:any) => this.toastr.error(err.error)
        });
    }
    else {
      this.toastr.warning("Please, enter valid data");
    }
  }
}

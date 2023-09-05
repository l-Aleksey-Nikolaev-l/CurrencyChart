import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import { ToastrService } from "ngx-toastr";
import { AuthService } from "../service/auth.service";


@Component({
  selector: 'app-userUpdate',
  templateUrl: './userUpdate.component.html',
  styleUrls: ['./userUpdate.component.css']
})
export class UserUpdateComponent implements OnInit {

  roleList:any;
  editData:any;
  accessForComponent:boolean = false;
  userAction:string = "User Is NOT Active";
  userActionLabelColor = "red";

  constructor(private formBuilder:FormBuilder,
              private services:AuthService,
              private toastr:ToastrService,
              @Inject(MAT_DIALOG_DATA) public data:any,
              private dialogRef:MatDialogRef<UserUpdateComponent>) {}

  updateForm = this.formBuilder.group({
    id:this.formBuilder.control(""),
    username:this.formBuilder.control("", Validators.required),
    password:this.formBuilder.control("", Validators.required),
    e_mail:this.formBuilder.control("", Validators.required),
    role:this.formBuilder.control("", Validators.required),
    isActive:this.formBuilder.control(false)
  });

  ngOnInit() {
    this.services.GetAllRoles().subscribe(rolesFromDB => {
      this.roleList = rolesFromDB;
    });

    this.services.GetForUpdate(this.data.userCode).subscribe(userFromDB => {
      this.editData = userFromDB;
      this.updateForm.setValue({
        id: this.editData.id,
        username: this.editData.username,
        password: this.editData.password,
        e_mail: this.editData.e_mail,
        role: this.editData.role,
        isActive: this.editData.isActive
      })
      if (Number(this.updateForm.value.id) !== 0) {
        this.accessForComponent = true;
      }
      this.UserAction();
    });
  }

  UserAction(){
    if(this.updateForm.value.isActive){
      this.userAction = "User Is Active";
      this.userActionLabelColor = "green";
    }
    else {
      this.userAction = "User Is NOT Active";
      this.userActionLabelColor = "red";
    }
  }

  UserAccount(event:any){
    if(event.submitter.name === "Update" && this.updateForm.valid){
      this.services.UpdatingProcedure(this.updateForm.value).subscribe((result:any) => {
        this.toastr.success(this.updateForm.value.username + "'s information updated", result);
      });
    }
    else if(event.submitter.name === "Delete"){
      this.services.DeletingProcedure(this.updateForm.value).subscribe((result:any) =>{
        this.toastr.success(this.updateForm.value.username + "'s account has been deleted", result);
      });
    }
    this.dialogRef.close();
  }
}

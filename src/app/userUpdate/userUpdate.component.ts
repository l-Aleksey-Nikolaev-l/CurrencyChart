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
    id:this.formBuilder.control('', Validators.required),
    name:this.formBuilder.control('', Validators.required),
    password:this.formBuilder.control('', Validators.required),
    e_mail:this.formBuilder.control('', Validators.required),
    role:this.formBuilder.control('', Validators.required),
    isActive:this.formBuilder.control(false)
  });

  ngOnInit() {
    this.services.GetAllRoles().subscribe(rolesFromDB => {
      this.roleList = rolesFromDB;
    });

    if(this.data.userCode != null || this.data.userCode != ""){
      this.services.GetForUpdate(this.data.userCode).subscribe(userFromDB =>{
        this.editData = userFromDB;
        this.updateForm.setValue({
          id:this.editData.id,
          name:this.editData.name,
          password:this.editData.password,
          e_mail:this.editData.e_mail,
          role:this.editData.role,
          isActive:this.editData.isActive
        })
        if(this.updateForm.value.id !== "Admin"){
          this.accessForComponent = true;
        }
        this.UserAction();
      });
    }
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
      this.services.UpdatingProcedure(this.updateForm.value.id, this.updateForm.value).subscribe(() => {
        this.toastr.success(this.updateForm.value.name + "'s information updated", "Done!");
      });
    }
    else if(event.submitter.name === "Delete"){
      this.services.DeletingProcedure(this.updateForm.value.id, this.updateForm.value).subscribe(() =>{
        this.toastr.success("Account " + this.updateForm.value.name + " have been deleted", "Done!");
      });
    }
    this.dialogRef.close();
  }
}

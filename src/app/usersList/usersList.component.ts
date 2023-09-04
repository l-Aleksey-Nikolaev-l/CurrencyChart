import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";

import { AuthService } from "../service/auth.service";
import { UserUpdateComponent } from "../userUpdate/userUpdate.component";
import { UserAddComponent } from "../userAdd/userAdd.component";

@Component({
  selector: 'app-usersList',
  templateUrl: './usersList.component.html',
  styleUrls: ['./usersList.component.css']
})
export class UsersListComponent {

  constructor(private services:AuthService,
              private dialog:MatDialog) {
    this.LoadUsers();
  }

  userList: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator !:MatPaginator;
  @ViewChild(MatSort) sort !:MatSort;

  LoadUsers(){
    this.services.GetAll().subscribe(usersFromDB => {
      this.userList = usersFromDB;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  displayedColumns: string[] = ['id', 'username', 'e_mail', 'role', 'isActive', 'action'];

  ActionWithUser(componentName:any, code:any){
    const popUpWindow = this.dialog.open(componentName, {
      enterAnimationDuration: "0.25s",
      exitAnimationDuration: "0.25s",
      width: "30%",
      minWidth: "300px",
      maxWidth: "400px",
      data:{
        userCode: {code}
      }
    })
    popUpWindow.afterClosed().subscribe(() => {
      this.LoadUsers();
    });
  }


  protected readonly UserAddComponent = UserAddComponent;
  protected readonly UserUpdateComponent = UserUpdateComponent;
}

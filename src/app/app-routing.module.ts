import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from "./guard/auth.guard";
import { HomeComponent } from "./home/home.component";
import { UsersListComponent } from "./usersList/usersList.component";
import { UserLoginComponent } from "./userLogin/userLogin.component";

const routes: Routes = [
  {
    path:"",
    component: HomeComponent,
    canActivate:[AuthGuard]
  },
  {
    path:"Login",
    component: UserLoginComponent
  },
  {
    path:"user",
    component: UsersListComponent,
    canActivate:[AuthGuard]
  },
  {
    path:"**",
    redirectTo: "",
    canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}


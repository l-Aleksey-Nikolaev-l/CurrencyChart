import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from "rxjs";
import { AuthService } from "../service/auth.service";

@Injectable({
  providedIn: "root"
})

export class AuthGuard implements CanActivate {

  constructor(private service:AuthService,
              private router:Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    if(this.service.CheckLogged()){
      if(this.UserAccess(route)){
        return true;
      }
      else {
        this.router.navigate([""]).then();
        return false;
      }
    }
    else {
      this.router.navigate(["Login"]).then();
      return false;
    }
  }

  UserAccess(getRoute:any){
    if (getRoute.url.length > 0 && getRoute.url[0].path === "user") {
      return this.service.GetUserRole();
    }
    else {
      return true;
    }
  }
}

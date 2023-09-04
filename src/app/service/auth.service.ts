import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  constructor(private http: HttpClient) {}

  apiUrl = 'https://json-test-beryl.vercel.app/';

  GetAll(){
    return this.http.get(this.apiUrl + "users");
  }

  GetAllRoles(){
    return  this.http.get(this.apiUrl + "roles");
  }

  GetForLogin(form:any){
    return  this.http.post(this.apiUrl + "login", form);
  }

  GetForUpdate(code: any){
    return this.http.post(this.apiUrl + "getUserInfo", code);
  }

  RegistrationProcedure(newUser: any){
    return this.http.post(this.apiUrl + "registration", newUser);
  }

  UpdatingProcedure(form: any){
    return this.http.post(this.apiUrl + "update", form);
  }

  DeletingProcedure(form: any){
    return this.http.delete(this.apiUrl, {body:form});
  }

  GetUserRole(){
    return sessionStorage.getItem("role") === "admin";
  }

  CheckLogged(){
    return sessionStorage.getItem("username") != null;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  apiUrl = 'https://json-test-beryl.vercel.app/user';

  GetAll(){
    return this.http.get(this.apiUrl);
  }

  GetAllRoles(){
    return this.http.get("https://json-test-beryl.vercel.app/role");
  }

  GetUserRole(){
    return sessionStorage.getItem("userRole") === "admin";
  }

  GetForLogin(code:any){
    return this.http.get(this.apiUrl + "?name=" + code);
  }

  GetForUpdate(code: any){
    return this.http.get(this.apiUrl + "/" + code);
  }

  RegistrationProcedure(inputData: any){
    return this.http.post(this.apiUrl, inputData);
  }

  UpdatingProcedure(code: any, inputData: any){
    return this.http.put(this.apiUrl + "/" + code, inputData);
  }

  DeletingProcedure(code: any, inputData: any){
    return this.http.delete(this.apiUrl + "/" + code, inputData);
  }

  CheckLogged(){
    return sessionStorage.getItem("userName") != null;
  }
}

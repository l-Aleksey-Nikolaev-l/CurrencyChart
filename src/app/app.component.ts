import { Router } from "@angular/router";
import { Component, DoCheck } from '@angular/core';

import { AuthService } from "./service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck{
  title = 'Currency Cart';

  isMenuRequired = false;
  isAdmin = false;

  constructor(private router:Router, private service:AuthService) {}

  ngDoCheck():void {

    let currentUrl = this.router.url;

    this.isMenuRequired = currentUrl != '/Login';

    this.isAdmin = this.service.GetUserRole();

  }
}

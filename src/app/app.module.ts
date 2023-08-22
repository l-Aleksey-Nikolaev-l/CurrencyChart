import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { NgOptimizedImage } from "@angular/common";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MaterialModule } from "../material.module";
import { ToastrModule } from "ngx-toastr";
import { UserLoginComponent } from './userLogin/userLogin.component';
import { UserAddComponent } from './userAdd/userAdd.component';
import { UserUpdateComponent } from './userUpdate/userUpdate.component';
import { UsersListComponent } from './usersList/usersList.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserAddComponent,
    UserLoginComponent,
    UsersListComponent,
    UserUpdateComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            preventDuplicates: true,
        }),
        MatButtonModule,
        MatIconModule,
        NgOptimizedImage,
        MatSlideToggleModule,
        HighchartsChartModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

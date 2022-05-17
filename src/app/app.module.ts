import {  HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from "./material/material.module";
import { HomeComponent } from './compponents/home/home.component';
import { MyListedNftsComponent } from './compponents/my-listed-nfts/my-listed-nfts.component';
import { NavBarComponent } from "./compponents/nav-bar/nav-bar.component";
import { MyNftsComponent } from './compponents/my-nfts/my-nfts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    
    MyListedNftsComponent,
    NavBarComponent,
    MyNftsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule, ReactiveFormsModule, FormsModule, NgbModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
   MatToolbarModule,
    MatButtonModule,
    MatInputModule,

    MatFormFieldModule,
  

    MatIconModule,
    MatProgressSpinnerModule,
  
    MatTooltipModule,
 
  ],
  exports: [
    CommonModule,
   
    MatButtonModule,
    MatInputModule,

    MatFormFieldModule,
  

    MatIconModule,
    MatProgressSpinnerModule,
  
    MatTooltipModule,
    MatToolbarModule
  
  ],
})
export class MaterialModule { }

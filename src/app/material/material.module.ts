import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatSliderModule,
  MatButtonToggleModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatInputModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSliderModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatInputModule,
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSliderModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatInputModule,
  ]
})
export class MaterialModule { }

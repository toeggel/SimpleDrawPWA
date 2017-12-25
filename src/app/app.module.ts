import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';

import { ColorPickerComponent } from './shared/color-picker/color-picker.component';
import { ToolService } from './services/tool.service';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    CanvasComponent,
    ContextMenuComponent,
    ColorPickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FlexLayoutModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [ToolService],
  bootstrap: [AppComponent]
})
export class AppModule { }

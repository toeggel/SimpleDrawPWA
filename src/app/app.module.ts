import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxElectronModule} from 'ngx-electron';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { ColorPickerComponent } from './shared/color-picker/color-picker.component';
import { ToolService } from './services/tool.service';
import { MenuBarComponent } from './menu-bar/menu-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    CanvasComponent,
    ContextMenuComponent,
    ColorPickerComponent,
    MenuBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FlexLayoutModule,
    NgxElectronModule,
    AppRoutingModule
  ],
  providers: [ToolService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgxElectronModule } from 'ngx-electron';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { ColorPickerComponent } from './shared/color-picker/color-picker.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { drawOptionsReducer, appReducers } from './app.reducer';
import { AppStore } from './app.store';

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
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 50, // Retains last x states
    }),
    AppRoutingModule
  ],
  providers: [AppStore],
  bootstrap: [AppComponent]
})
export class AppModule { }

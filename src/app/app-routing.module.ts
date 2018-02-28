import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanvasComponent } from './canvas/canvas.component';

const routes: Routes = [
   { path: '', pathMatch: 'full', redirectTo: 'canvas' },
   { path: 'canvas', component: CanvasComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component, Renderer2, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private renderer: Renderer2) {
    if (!navigator.onLine) {
      this.renderer.addClass(document.body, 'offline');
    }
  }

  @HostListener('window:online')
  public onOnline() {
    this.renderer.removeClass(document.body, 'offline');
  }

  @HostListener('window:offline')
  public onOffline() {
    this.renderer.addClass(document.body, 'offline');
  }
}

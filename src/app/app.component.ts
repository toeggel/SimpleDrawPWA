import { Component, Renderer2, HostListener } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public isElectronApp = false;

  public get isInFullScreen() {
    if (this.isElectronApp) {
      return this.electronService.remote.getCurrentWindow().isFullScreen();
    } else {
      return false;
    }
  }

  constructor(private renderer: Renderer2, private electronService: ElectronService) {
    if (!navigator.onLine) {
      this.renderer.addClass(document.body, 'offline');
    }

    this.isElectronApp = this.electronService.isElectronApp;
  }

  @HostListener('window:online')
  public onOnline() {
    this.renderer.removeClass(document.body, 'offline');
  }

  @HostListener('window:offline')
  public onOffline() {
    this.renderer.addClass(document.body, 'offline');
  }

  public onClose() {
    if (this.isElectronApp) {
      this.electronService.remote.getCurrentWindow().close();
    }
  }

  public onMinimize() {
    if (this.isElectronApp) {
      this.electronService.remote.getCurrentWindow().minimize();
    }
  }

  public onEnterFullScreen() {
    if (this.isElectronApp) {
      this.electronService.remote.getCurrentWindow().setFullScreen(true);
    }
  }

  public onExitFullScreen() {
    if (this.isElectronApp) {
      this.electronService.remote.getCurrentWindow().setFullScreen(false);
    }
  }
}

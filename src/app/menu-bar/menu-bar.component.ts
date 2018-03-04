import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {
  @Output() minimize: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() enterFullScreen: EventEmitter<any> = new EventEmitter();
  @Output() exitFullScreen: EventEmitter<any> = new EventEmitter();
  @Input() isInFullScreen = false;
}

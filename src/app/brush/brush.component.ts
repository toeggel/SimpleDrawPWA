import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-brush',
  templateUrl: './brush.component.html',
  styleUrls: ['./brush.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrushComponent {
  @Input() size: number;
  @Input() color = '#ffffff';
}

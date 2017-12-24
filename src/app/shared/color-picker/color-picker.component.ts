import { Component, OnInit, Input } from '@angular/core';
import { BrushService } from '../../services/brush.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  public selectedColor = '#000000';
  constructor(private brushService: BrushService) { }

  ngOnInit() {
  }

  public setColor(color: string) {
    this.selectedColor = color;
    this.brushService.changeColor(color);
  }

  public getHexColors(): string[] {
    return [
      '#f44336',
      '#e91e63',
      '#9c27b0',
      '#673ab7',
      '#3f51b5',
      '#2196f3',
      '#03a9f4',
      '#00bcd4',
      '#009688',
      '#4caf50',
      '#8bc34a',
      '#cddc39',
      '#ffeb3b',
      '#ffc107',
      '#ff9800',
      '#ff5722',
      '#795548',
      '#9e9e9e',
      '#607d8b',
      '#000000',
      // '#ffffff',

      // '#000000',
      // '#864201',
      // '#FF1400',
      // '#FE6A00',
      // '#FFD42D',
      // '#00FC41',
      // '#555555',
      // '#452403',
      // '#860A00',
      // '#843701',
      // '#836A16',
      // '#007D21',
      // '#A6A6A6',
      // '#01FDF6',
      // '#0196FD',
      // '#003FFA',
      // '#B431F9',
      // '#FF1D69',
      // '#FFFFFF',
      // '#007E7D',
      // '#004C7D',
      // '#00217E',
      // '#5C187D',
      // '#850E36',
    ];
  }
}

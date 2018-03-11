import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../../material/material.module';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ColorPickerComponent],
      imports: [MaterialModule, FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectedColor', () => {
    describe('get', () => {
      it('return the color of the active tool', () => {

        this.toolServiceMock.getActiveTool.and.returnValue({
          toolOptions: {
            toolSize: '3',
            toolColor: '#112233',
          }
        });

        expect(component.selectedColor).toBe('#112233');
      });
    });
  });

});

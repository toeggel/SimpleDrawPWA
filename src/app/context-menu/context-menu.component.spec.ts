import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';
import { MockComponent } from '../../testing/mock-component';
import { ContextMenuComponent } from './context-menu.component';
import { ColorPickerComponent } from '../shared/color-picker/color-picker.component';
import { ToolService } from '../services/tool.service';

describe('ContextMenuComponent', () => {
  let component: ContextMenuComponent;
  let fixture: ComponentFixture<ContextMenuComponent>;

  beforeEach(async(() => {
    this.toolServiceMock = jasmine.createSpyObj<ToolService>(ToolService.name, ['getActiveTool']);

    this.toolServiceMock.getActiveTool.and.returnValue({
      toolOptions: {
        toolSize: '3',
        toolColor: '#112233',
      }
    });

    TestBed.configureTestingModule({
      declarations: [ContextMenuComponent, MockComponent(ColorPickerComponent)],
      imports: [MaterialModule, FormsModule],
      providers: [ToolService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

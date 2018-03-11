import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockComponent } from 'mock-component';

import { MaterialModule } from '../material/material.module';
import { ContextMenuComponent } from './context-menu.component';
import { ColorPickerComponent } from '../shared/color-picker/color-picker.component';

describe('ContextMenuComponent', () => {
  let component: ContextMenuComponent;
  let fixture: ComponentFixture<ContextMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContextMenuComponent, MockComponent(ColorPickerComponent)],
      imports: [MaterialModule, FormsModule],
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

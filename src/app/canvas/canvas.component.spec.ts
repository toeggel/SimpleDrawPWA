import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MockComponent } from 'mock-component';

import { MaterialModule } from '../material/material.module';
import { AppStore, DrawOptions } from '../app.store';
import { CanvasComponent } from './canvas.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { BrushComponent } from '../brush/brush.component';
import { ToolType } from '../models';

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

  beforeEach(
    async(() => {
      this.appStoreMock = {
        drawing$: of({ current: [], future: [] }),
        drawContext$: of({ size: 4, color: '#ffffff' }),
        tool$: of({ type: ToolType.Brush })
      };

      TestBed.configureTestingModule({
        declarations: [
          CanvasComponent,
          MockComponent(ContextMenuComponent),
          MockComponent(BrushComponent)
        ],
        imports: [MaterialModule, FormsModule],
        providers: [{ provide: AppStore, useValue: this.appStoreMock }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

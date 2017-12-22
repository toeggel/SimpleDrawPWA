import { TestBed, inject } from '@angular/core/testing';

import { BrushService } from './brush.service';

describe('BrushService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrushService]
    });
  });

  it('should be created', inject([BrushService], (service: BrushService) => {
    expect(service).toBeTruthy();
  }));
});

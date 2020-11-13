import { TestBed } from '@angular/core/testing';

import { OptimizarService } from './optimizar.service';

describe('OptimizarService', () => {
  let service: OptimizarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptimizarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { Generar3DService } from './generar3-d.service';

describe('Generar3DService', () => {
  let service: Generar3DService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Generar3DService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

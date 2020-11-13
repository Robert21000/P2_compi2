import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizacionComponent } from './optimizacion.component';

describe('OptimizacionComponent', () => {
  let component: OptimizacionComponent;
  let fixture: ComponentFixture<OptimizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

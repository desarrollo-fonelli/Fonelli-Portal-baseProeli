import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteventasComponent } from './reporteventas.component';

describe('ReporteventasComponent', () => {
  let component: ReporteventasComponent;
  let fixture: ComponentFixture<ReporteventasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteventasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteventasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

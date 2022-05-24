import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosclientesComponent } from './datosclientes.component';

describe('DatosclientesComponent', () => {
  let component: DatosclientesComponent;
  let fixture: ComponentFixture<DatosclientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosclientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosclientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

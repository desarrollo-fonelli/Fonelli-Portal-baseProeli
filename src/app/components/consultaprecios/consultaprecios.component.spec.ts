import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultapreciosComponent } from './consultaprecios.component';

describe('ConsultapreciosComponent', () => {
  let component: ConsultapreciosComponent;
  let fixture: ComponentFixture<ConsultapreciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultapreciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultapreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultainactivosComponent } from './consultainactivos.component';

describe('ConsultainactivosComponent', () => {
  let component: ConsultainactivosComponent;
  let fixture: ComponentFixture<ConsultainactivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultainactivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultainactivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

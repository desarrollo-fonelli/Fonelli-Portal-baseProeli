import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresventaComponent } from './indicadoresventa.component';

describe('IndicadoresventaComponent', () => {
  let component: IndicadoresventaComponent;
  let fixture: ComponentFixture<IndicadoresventaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicadoresventaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresventaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasarticuloComponent } from './ventasarticulo.component';

describe('VentasarticuloComponent', () => {
  let component: VentasarticuloComponent;
  let fixture: ComponentFixture<VentasarticuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasarticuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasarticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

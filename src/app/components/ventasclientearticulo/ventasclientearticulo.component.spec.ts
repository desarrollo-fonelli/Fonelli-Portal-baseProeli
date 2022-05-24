import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasclientearticuloComponent } from './ventasclientearticulo.component';

describe('VentasclientearticuloComponent', () => {
  let component: VentasclientearticuloComponent;
  let fixture: ComponentFixture<VentasclientearticuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasclientearticuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasclientearticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

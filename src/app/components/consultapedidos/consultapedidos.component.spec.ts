import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultapedidosComponent } from './consultapedidos.component';

describe('ConsultapedidosComponent', () => {
  let component: ConsultapedidosComponent;
  let fixture: ComponentFixture<ConsultapedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultapedidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultapedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

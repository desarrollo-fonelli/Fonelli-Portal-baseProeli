import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacionpedidosComponent } from './relacionpedidos.component';

describe('RelacionpedidosComponent', () => {
  let component: RelacionpedidosComponent;
  let fixture: ComponentFixture<RelacionpedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelacionpedidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelacionpedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

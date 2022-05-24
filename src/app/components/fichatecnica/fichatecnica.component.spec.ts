import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichatecnicaComponent } from './fichatecnica.component';

describe('FichatecnicaComponent', () => {
  let component: FichatecnicaComponent;
  let fixture: ComponentFixture<FichatecnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichatecnicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichatecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

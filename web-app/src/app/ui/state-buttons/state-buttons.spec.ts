import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateButtons } from './state-buttons';

describe('StateButtons', () => {
  let component: StateButtons;
  let fixture: ComponentFixture<StateButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateButtons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSelector } from './action-selector.component';

describe('ActionSelector', () => {
  let component: ActionSelector;
  let fixture: ComponentFixture<ActionSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

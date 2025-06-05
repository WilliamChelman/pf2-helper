import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAdder } from './card-adder.component';

describe('CardAdder', () => {
  let component: CardAdder;
  let fixture: ComponentFixture<CardAdder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAdder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAdder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnyCard } from './any-card.component';

describe('AnyCard', () => {
  let component: AnyCard;
  let fixture: ComponentFixture<AnyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnyCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnyCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

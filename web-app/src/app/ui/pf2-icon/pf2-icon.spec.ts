import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pf2Icon } from './pf2-icon.component';

describe('Pf2Icon', () => {
  let component: Pf2Icon;
  let fixture: ComponentFixture<Pf2Icon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pf2Icon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pf2Icon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

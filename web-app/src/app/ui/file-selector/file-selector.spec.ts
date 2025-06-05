import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSelector } from './file-selector.component';

describe('FileSelector', () => {
  let component: FileSelector;
  let fixture: ComponentFixture<FileSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

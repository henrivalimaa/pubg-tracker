import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonDialogComponent } from './comparison-dialog.component';

describe('ComparisonDialogComponent', () => {
  let component: ComparisonDialogComponent;
  let fixture: ComponentFixture<ComparisonDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

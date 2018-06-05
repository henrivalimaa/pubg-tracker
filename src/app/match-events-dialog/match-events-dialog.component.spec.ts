import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchEventsDialogComponent } from './match-events-dialog.component';

describe('MatchEventsDialogComponent', () => {
  let component: MatchEventsDialogComponent;
  let fixture: ComponentFixture<MatchEventsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchEventsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchEventsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

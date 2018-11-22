import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDialogEntityComponent } from './confirmation-dialog-entity.component';

describe('ConfirmationDialogEntityComponent', () => {
  let component: ConfirmationDialogEntityComponent;
  let fixture: ComponentFixture<ConfirmationDialogEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationDialogEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

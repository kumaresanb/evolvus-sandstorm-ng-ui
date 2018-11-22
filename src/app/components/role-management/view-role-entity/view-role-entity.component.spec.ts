import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoleEntityComponent } from './view-role-entity.component';

describe('ViewRoleEntityComponent', () => {
  let component: ViewRoleEntityComponent;
  let fixture: ComponentFixture<ViewRoleEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRoleEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRoleEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

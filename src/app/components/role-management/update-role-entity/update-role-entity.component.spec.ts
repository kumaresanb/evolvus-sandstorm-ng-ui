import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRoleEntityComponent } from './update-role-entity.component';

describe('UpdateRoleEntityComponent', () => {
  let component: UpdateRoleEntityComponent;
  let fixture: ComponentFixture<UpdateRoleEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRoleEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRoleEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

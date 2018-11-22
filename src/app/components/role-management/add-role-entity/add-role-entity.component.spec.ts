import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleEntityComponent } from './add-role-entity.component';

describe('AddRoleEntityComponent', () => {
  let component: AddRoleEntityComponent;
  let fixture: ComponentFixture<AddRoleEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoleEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoleEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

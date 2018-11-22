import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRolesEntityComponent } from './list-roles-entity.component';

describe('ListRolesEntityComponent', () => {
  let component: ListRolesEntityComponent;
  let fixture: ComponentFixture<ListRolesEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRolesEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRolesEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

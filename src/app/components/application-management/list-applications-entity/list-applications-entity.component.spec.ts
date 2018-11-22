import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApplicationsEntityComponent } from './list-applications-entity.component';

describe('ListApplicationsEntityComponent', () => {
  let component: ListApplicationsEntityComponent;
  let fixture: ComponentFixture<ListApplicationsEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListApplicationsEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListApplicationsEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

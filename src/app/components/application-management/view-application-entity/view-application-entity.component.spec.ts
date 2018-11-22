import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApplicationEntityComponent } from './view-application-entity.component';

describe('ViewApplicationEntityComponent', () => {
  let component: ViewApplicationEntityComponent;
  let fixture: ComponentFixture<ViewApplicationEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewApplicationEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewApplicationEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEntityComponent } from './update-entity.component';

describe('UpdateEntityComponent', () => {
  let component: UpdateEntityComponent;
  let fixture: ComponentFixture<UpdateEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

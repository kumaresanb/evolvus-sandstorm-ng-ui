import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateApplicationEntityComponent } from './update-application-entity.component';

describe('ViewUpdateApplicationEntityComponent', () => {
  let component: UpdateApplicationEntityComponent;
  let fixture: ComponentFixture<UpdateApplicationEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateApplicationEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateApplicationEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

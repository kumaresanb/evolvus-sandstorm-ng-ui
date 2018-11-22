import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveApplicationEntityComponent } from './save-application-entity.component';

describe('SaveApplicationEntityComponent', () => {
  let component: SaveApplicationEntityComponent;
  let fixture: ComponentFixture<SaveApplicationEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveApplicationEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveApplicationEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

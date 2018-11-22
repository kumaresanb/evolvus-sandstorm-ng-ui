import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginConsoleComponent } from './login-console.component';

describe('LoginConsoleComponent', () => {
  let component: LoginConsoleComponent;
  let fixture: ComponentFixture<LoginConsoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginConsoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

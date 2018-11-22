import { AuthenticationService } from './login-console/authentication/login/login.service';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  subscribe: Subscription;
  isAuthenticated: boolean = false;
  
  constructor(private authService:AuthenticationService) { }

  ngOnInit() {
    // add the the body classes
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
    this.subscribe = this.authService.authenticatedSubject.subscribe((status : boolean) => {
      this.isAuthenticated = status;
  });
  }

   ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
    this.subscribe.unsubscribe();
  }
}

import { AuthenticationService } from './../../login-console/authentication/login/login.service';
import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
@Component({
  selector: 'app-not-found',
  templateUrl: '../../../not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(private router : Router, private authenticationService: AuthenticationService
  ) { }
  color = 'primary';
  mode = 'indeterminate';
  value = 25;  
  loadOpacity: boolean = true;
  
  ngOnInit() {
    setTimeout(()=>{
      this.login();
  }, 3000);
  }

  login() {
    this.authenticationService.logout(); 
  }
}

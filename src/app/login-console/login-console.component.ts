import { BehaviorSubject } from "rxjs";
import { Subject } from "rxjs";
import { environment } from "./../../environments/environment";
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from "@angular/core";

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "./authentication/login/login.service";
import { Authentication } from "../models/authentication.model";
import { SandstormGlobalVariablesService } from "./../shared/sandstorm-global-variables.service";
import { UserDataService } from "../components/user-management/user-data.service";
import { animationFrameScheduler } from "rxjs";

@Component({
  selector: "app-login-console",
  templateUrl: "./login-console.component.html",
  styleUrls: ["./login-console.component.css"]
})
export class LoginConsoleComponent implements OnInit {
  usernameShow: boolean = true;
  userpasswordShow: boolean = false;
  loginForm: FormGroup;
  dateFormat: string;
  loginErrorMessage: string = "";
  isUserAuthenticated = false;
  viewUserNameComponent: boolean = true;
  viewPasswordComponent: boolean = false;
  color = "primary";
  mode = "indeterminate";
  value = 25; 
  eyeOpen = false;  
  passwordType: string = "password";
  doesUserExists: boolean = false;
  isInternetAvailable: boolean = navigator.onLine;
  emitMe = new BehaviorSubject<number>(5);
  loggedInUser = {};
  user = new BehaviorSubject<any>(this.loggedInUser);
  transitionToPasswordPage: boolean = false;
  displayError: boolean = false; 
  loginButtonType: string = "button";
  nextButtonType: string = "submit";
  constructor(
    el: ElementRef,
    private authenticationService: AuthenticationService,
    private router: Router,
    private globalVariableService: SandstormGlobalVariablesService,
    private userDataService: UserDataService
  ) {
   
  }
   
  ngOnInit() {  
    this.loginForm = new FormGroup({
      userId: new FormControl("", [
        Validators.required,
        Validators.minLength(6)
      ]),
      userPassword: new FormControl("", [
        Validators.required,
        Validators.minLength(6)
      ])
    });

    window.setInterval(() => {
      if (!navigator.onLine) {
        this.isInternetAvailable = false;
      }
    }, 1500);

    this.loginForm.setErrors({ exist: null });
  }

  login() {
    if (!this.loginForm.invalid) {
      this.loginForm.setErrors(null);
      const userName = this.loginForm.value.userId;
      const userPassword = this.loginForm.value.userPassword;
      const authentication = new Authentication(
        userName,
        userPassword,
        "SANDSTORM"
      );
      this.authenticationService.authenticate(authentication).subscribe(
        (user: any) => {
          if (user != null) {
            this.isUserAuthenticated = true;
            this.displayError = false;
            setTimeout(() => {
              this.authenticationService.isAuthenticated = true;
              this.authenticationService.authenticatedSubject.next(
                this.authenticationService.isAuthenticated
              );                           
              this.authenticationService.setToken(user.token);
              this.authenticationService.dtFormat = "dd/MM/yyyy hh:mm:ss";
              this.dateFormat = this.authenticationService.dtFormat;
              // this.globalVariableService.currentUser = user.data; 
              this.globalVariableService.currentUser.next(user.data);   

              this.router.navigate(["home"]);
            }, 1000);  
          } else {
            this.router.navigate(["login"]);
          }
        }, 
        err => {   
          if (err.error) {     
            this.displayError = true;
            if (err.error.status == "401" && err.error.data=='404 Not Found') {
              this.generateErrorMessage("auth"); 
            } else {
              this.generateErrorMessage("server");
            }
          }else{
            //
          }

          this.authenticationService.isAuthenticated = false;
          this.authenticationService.authenticatedSubject.next(
            this.authenticationService.isAuthenticated
          );

          this.loginForm.reset();
          this.viewPasswordComponent = false;
          this.viewUserNameComponent = true;
          this.router.navigate(["login"]);
        }
      );
    } else {
      this.displayError = true;
      this.loginForm.controls["userPassword"].setErrors({ incorrect: true });
    }
  }

  changeView(action) {
    this.loginErrorMessage = "";
    if (!this.loginForm.controls.userId.invalid) {
      this.transition("loading");
      if (action == 'next') {
        this.authenticationService.verify(''); // Need to change this.
        this.displayError = false;
        this.authenticationService  
          .responseData
          .subscribe(   
            (response: any) => {  
              if (response != null) {
                if (response.data == true) {
                  this.changeButtonType(1);
                  this.loginErrorMessage = null;
                  this.displayError = false;
                  this.doesUserExists = false;
                  this.loginForm.setErrors({ exist: true });
                  this.transition("loaded");
                  this.viewUserNameComponent = !this.viewUserNameComponent;
                  this.viewPasswordComponent = !this.viewPasswordComponent;
                  this.usernameShow = !this.usernameShow;
                } else {
                  this.loginForm.setErrors({ exist: false });
                  this.doesUserExists = true;
                  this.transition("loaded");
                }
              } else { //when response is null. Most probably when zuul is running and platform service is down
                setTimeout(()=>{
                  this.changeView('next');
                }, 3000) 
              }
            },  
            err => {
              this.transition("loaded");
              this.generateErrorMessage("server");
              this.displayError = true;
            }
          );
      } else {
        // back button action
        this.loginForm.controls["userPassword"].setValue("");
        this.displayError = false;
        this.changeButtonType(-1);
        setTimeout(() => {
          this.doesUserExists = false;
          this.loginForm.setErrors({ exist: null });
          this.transition("loaded");
          this.viewUserNameComponent = !this.viewUserNameComponent;
          this.viewPasswordComponent = !this.viewPasswordComponent;
          this.usernameShow = !this.usernameShow;
        }, 500);
      }
    }
  }

  reset() {
    this.loginForm.reset();
    this.doesUserExists = false;
    this.displayError = false;
  }

  transition(action) {
    if (action == "loaded") {
      document.getElementById("login-page").style.opacity = "1";
      this.transitionToPasswordPage = false;
    } else if (action == "loading") {
      this.transitionToPasswordPage = true;
      document.getElementById("login-page").style.opacity = "0.7";
    }
  }

  generateErrorMessage(type) {
    if (type == "server") {
      this.loginErrorMessage = "Oops! The request hit a wall. Try again!";
    } else if (type == "auth") {
      this.loginErrorMessage = "UserId - Password doesn't match";
    }
  }

  changeInputType() {
    this.eyeOpen = !this.eyeOpen;
    if (!this.eyeOpen) {
      this.passwordType = "password";
    } else {
      this.passwordType = "text";
    }
  }

  changeButtonType(type){
    if(type==1){
      this.loginButtonType = 'submit';
      this.nextButtonType = 'button';
    }else{
      this.loginButtonType = 'button';
      this.nextButtonType = 'submit';
    }
  }


} 

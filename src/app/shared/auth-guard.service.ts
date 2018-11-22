import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {
  HttpEvent,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
  HttpClient
} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { AuthenticationService } from './../login-console/authentication/login/login.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
  serviceUrl = environment.platformURL;
  headers: HttpHeaders;

  constructor(private authService: AuthenticationService, private router: Router, private http: HttpClient) { 
    this.headers = new HttpHeaders({"Content-Type": "application/json"});
  }

  canActivate(router: ActivatedRouteSnapshot ,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{


    
   this.isSessionActive().subscribe((session : any) => {
          if (session != null) {
         return new Observable<true>();
          } else  {
            this.router.navigate(['login']);
            return new Observable<false>();
          }
      }, (err) => {
          this.authService.isAuthenticated = false;
          this.authService.authenticatedSubject.next(this.authService.isAuthenticated);
          this.router.navigate(['sessionExpired']);
          return new Observable<true>(); 
      });
return true;
  }

  isSessionActive() {
    return this.http.get(`${this.serviceUrl}/sessionCheck`, {headers: this.headers});
}


}

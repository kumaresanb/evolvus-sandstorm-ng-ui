import { Injectable, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs";

@Injectable()
export class ResponsiveService {

  constructor() { }
  ngOnInit() {

  }
  private isMobile = new Subject<boolean>();
  public screenWidth: string;
  sideNavOpen = new Subject<boolean>();
  isSideNavOpen: boolean = false;

  onMobileChange(status: boolean) {
    this.isMobile.next(status);
  }
  sideNavNotification(sideNavNotify: boolean) {
    if (sideNavNotify === true) {
      this.sideNavOpen.next(true);
      this.isSideNavOpen = true;
    } else {
      this.sideNavOpen.next(false);
      this.isSideNavOpen = false;

    }
  }
  getMobileStatus(): Observable<any> {
    return this.isMobile.asObservable();
  }

  public checkWidth() {
    var width = window.innerWidth;
    if (width <= 768) {
      this.screenWidth = 'sm';
      this.onMobileChange(true);
    } else if (width > 768 && width <= 992) {
      this.screenWidth = 'md';
      this.onMobileChange(false);
    } else {
      this.screenWidth = 'lg';
      this.onMobileChange(false);
    }
  }

}

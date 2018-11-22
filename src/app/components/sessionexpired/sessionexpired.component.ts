import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({selector: "app-sessionexpired", templateUrl: "./sessionexpired.component.html", styleUrls: ["./sessionexpired.component.css"]})
export class SessionexpiredComponent implements OnInit {
    constructor(private router : Router) {}

    color = 'primary';
    mode = 'indeterminate';
    value = 50;

    ngOnInit() {
        setTimeout(()=>{
            this.login();
        }, 3000);
    }

    login() {
        this.router.navigate(['login']);
    }
}

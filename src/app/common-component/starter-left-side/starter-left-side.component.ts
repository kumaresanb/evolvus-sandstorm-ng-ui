import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "./../../login-console/authentication/login/login.service";
import { SandstormGlobalVariablesService } from "./../../shared/sandstorm-global-variables.service";

@Component({
  selector: "app-starter-left-side",
  templateUrl: "./starter-left-side.component.html",
  styleUrls: ["./starter-left-side.component.css"]
})
export class StarterLeftSideComponent implements OnInit {
  userMenuGroups: any;
  user: any;
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private globalVariableService: SandstormGlobalVariablesService
  ) {}

  ngOnInit() {
    this.user = this.globalVariableService.currentUser.getValue();
  }


}

import { RoleModel } from "./../../role-management/role-model";
import { EntityModel } from "./../../entity-management/entity.model";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { UserDataService } from "./../user-data.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"]
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  // listOfTimeZones: any[] = [];
  listOfMasterCurrency: any[] = [];

  filteredEntityNames: Observable<string[]> = new Observable<string[]>();
  listOfEntityNames: string[] = [];
  listOfEntities: any;
  filteredRoleNames: Observable<string[]> = new Observable<string[]>();
  listOfRoleNames: string[] = [];
  listOfRoles: any;
  loggedInUser: any;
  // listOfSubMenuItems: any = [];
  constructor(
    private userDataService: UserDataService,
    private router: Router
  ) {
    this.userForm = new FormGroup({
      userId: new FormControl("", [
        Validators.pattern("[a-zA-Z0-9_-]*"),
        Validators.pattern(/^\S*$/),
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(35)
      ]),
      userName: new FormControl("", [
        Validators.minLength(6),
        Validators.maxLength(140),
        Validators.required
      ]),
      designation: new FormControl("", [Validators.minLength(6), Validators.maxLength(35), Validators.pattern("[a-zA-Z \-\]*")]),
      role: new FormControl("", [Validators.required]),
      entity: new FormControl("", [Validators.required]),
      emailId: new FormControl("", [Validators.required, Validators.email]),
      phoneNumber: new FormControl("", Validators.pattern("[0-9]{10}")),
      mobileNumber: new FormControl("",Validators.pattern("[0-9]{10}")),
      
      country: new FormControl("", [
        Validators.required,
        Validators.pattern("[a-zA-Z \-\]*"),
        Validators.maxLength(140)
      ]),
      state: new FormControl("", [
        Validators.required,
        Validators.pattern("[a-zA-Z \-\]*"),
        Validators.maxLength(140)
      ]),
      city: new FormControl("", [
        Validators.required,
        Validators.pattern("[a-zA-Z \-\]*"),
        Validators.maxLength(140)
      ]),
      // timeZone: new FormControl("", [Validators.required]),
      individualTransactionLimit: new FormControl("", Validators.required),
      dailyLimit: new FormControl("", Validators.required),
      currency: new FormControl("", Validators.required),
      faxNumber: new FormControl("", [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]{10}")])
    });
  }

  ngOnInit() {
    this.userDataService.getAllMasterCurrency().subscribe((response: any) => {
      if (response.data.length != 0) {
        this.listOfMasterCurrency = response.data;
      }
    });

    this.userDataService.getAllEntities().subscribe((response: any) => {
      this.listOfEntities = response.data;
      if (response.data.length != 0) {
        this.listOfEntityNames = this.listOfEntities.map(entity => entity.name);
        this.getFilteredEntityNames();
      }
    });
    this.userDataService.getAllRoleData(0, 1).subscribe((response: any) => {
      if (response.data.length != 0) {
        this.listOfRoles = response.data;
        this.listOfRoleNames = this.listOfRoles.map(role => role.roleName);
        this.getFilteredRoleNames();
      }
    });
    this.loggedInUser = this.userDataService.getCurrentUserData();
    // this.listOfSubMenuItems = this.userDataService.getListOfSubMenuItems();
  }

  save() {
    if (this.isAValidSelection("entity", this.userForm.value.entity)) {
      if (this.isAValidSelection("role", this.userForm.value.role)) {
        this.userDataService
          .save(
            this.userForm,
            this.listOfRoles,
            this.listOfEntities,
            this.listOfMasterCurrency
          )
          .subscribe(
            (response: any) => {
              this.userDataService
                .openDialog("success", response.description)
                .subscribe(result => {
                  this.router.navigate(["userManagement"]);
                });
            },
            err => {
              this.userDataService
                .openDialog("error", err.error.description + ".")
                .subscribe(result => {
                  // Dialog Response can be handled here
                });
            }
          );
      } else {
        this.userDataService
          .openDialog("error", "Please Select a Valid Role" + ".")
          .subscribe(result => {
            // Dialog Response can be handled here
          });
      }
    } else {
      this.userDataService
        .openDialog("error", "Please Select a Valid Branch" + ".")
        .subscribe(result => {
          // Dialog Response can be handled here
        });
    }
  }

  getFilteredEntityNames() {
    this.filteredEntityNames = this.userForm.controls.entity.valueChanges.pipe(
      startWith(""),
      map(
        entityName =>
          entityName
            ? this.filterEntities(entityName)
            : this.listOfEntityNames.slice()
      )
    );
  }

  getFilteredRoleNames() {
    this.filteredRoleNames = this.userForm.controls.role.valueChanges.pipe(
      startWith(""),
      map(
        roleName =>
          roleName ? this.filterRoles(roleName) : this.listOfRoleNames.slice()
      )
    );
  }

  private filterEntities(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listOfEntityNames.filter(
      entityName => entityName.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private filterRoles(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listOfRoleNames.filter(
      roleName => roleName.toLowerCase().indexOf(filterValue) === 0
    );
  }

  isAValidSelection(propertyName, value) {
    if (propertyName == "entity") {
      if (this.listOfEntityNames.includes(value)) {
        return true;
      } else {
        return false;
      }
    }
    if (propertyName == "role") {
      if (this.listOfRoleNames.includes(value)) {
        return true;
      } else {
        return false;
      }
    }
  }

  // doIExist(title){
  //   return this.listOfSubMenuItems.includes(title);
  //   }

toUpperCase(event){
   event.target.value = event.target.value.toUpperCase();
}


}

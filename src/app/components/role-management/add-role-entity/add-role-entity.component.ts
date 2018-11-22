import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  NgForm,
  FormArray,
  Validators
} from "@angular/forms";
import { RoleModel } from "../role-model";
import { MenuGroup } from "../role-model";
import { MenuItems } from "../role-model";
import { RoleDataService } from "../role-data.service";
import { Router } from "@angular/router";
import { min, max } from "rxjs/operators";

@Component({
  selector: "app-add-role-entity",
  templateUrl: "./add-role-entity.component.html",
  styleUrls: ["./add-role-entity.component.css"]
})
export class AddRoleEntityComponent implements OnInit {
  listOfApplicationCategory: string[] = [];
  listOfMenuGroups: MenuGroup[]=[];
  applicationCategorySelected: boolean = false;
  roleForm: FormGroup;
  menuGroupNotSelected: boolean;
  listOfApplications: any[]=[];
  listOfRoleTypes: any[]=[];
  listOfTxnTypes: any[]=[];
  user: any; //currently loggedIn User
  // listOfSubMenuItems: any= [];
  selectedMenuGroups: any[] = [];
  selectedMenuItems: any[] = [];
  selectedSubMenuItems: any[] = [];

  constructor(
    private roleDataService: RoleDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.roleDataService.getCurrentUserData().subscribe((user: any) => {
      if(user!=null){
        this.user = user;
      }
    });
    // this.listOfSubMenuItems = this.roleDataService.getListOfSubMenuItems();

    this.roleForm = new FormGroup({
      roleName: new FormControl("", [
        Validators.pattern("[a-zA-Z0-9_-]*"),
        Validators.pattern(/^\S*$/),
        Validators.minLength(6),
        Validators.maxLength(35),
        Validators.required
      ]),
      applicationCode: new FormControl("", Validators.required),
      description: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(140)
      ]),
      roleType: new FormControl("", Validators.required),
      // txnType: new FormControl([], Validators.required)
    });

    //data for the input fields

    this.getApplicationCodes();
    this.getRoleTypes();
    this.getTxtTypes();
  }

  getApplicationCodes() {
    this.roleDataService
      .getlistOfApplicationCategory()
      .subscribe((response: any) => {
        if(response!=null){
          this.listOfApplications = response.data;
          this.listOfApplicationCategory = this.listOfApplications.map(
            application => application.applicationCode
          );
        }
      });
  }

  abortSaveAction() {
    this.router.navigate(["/roleManagement"]);
  }

  getMenuGroups(applicationCode) {
    this.applicationCategorySelected = true;
    this.roleDataService
      .getListOfMenuGroups(applicationCode)
      .subscribe((response: any) => {
        if(response!=null){
          this.listOfMenuGroups = response.data;
        }
      });
  }

  addMenuItem(menuGroupFromUser, menuItemFromUser) {
    menuGroupFromUser.selectedFlag = true;
    menuItemFromUser.selectedFlag = !menuItemFromUser.selectedFlag;
  }
  addSubMenuItem(menuItemFromUser, subMenuItemFromUser) {
    subMenuItemFromUser.selectedFlag = !subMenuItemFromUser.selectedFlag;
  }

  save() {
    this.selectedMenuGroups = this.listOfMenuGroups.filter(menuGroup => menuGroup.selectedFlag==true);

    for (var mgIndex = 0; mgIndex < this.selectedMenuGroups.length; mgIndex++) {
      this.selectedMenuGroups[mgIndex].menuItems = this.selectedMenuGroups[
        mgIndex
      ].menuItems.filter(menuItem => menuItem.selectedFlag == true);

if(this.selectedMenuGroups[mgIndex].menuItems.length!=0){
  for (
    var miIndex = 0;
    miIndex < this.selectedMenuGroups[mgIndex].menuItems.length;
    miIndex++
  ) {
    if(this.selectedMenuGroups[mgIndex].menuItems[miIndex].subMenuItems){
      this.selectedMenuGroups[mgIndex].menuItems[miIndex].subMenuItems = this.selectedMenuGroups[mgIndex].menuItems[miIndex].subMenuItems.filter(subMenuItem => subMenuItem.selectedFlag == true);
    }
  }
}else{
  this.selectedMenuGroups.splice(mgIndex, 1);
}

    }

    var roleData = {
      roleName: this.roleForm.value.roleName,
      applicationCode: this.roleForm.value.applicationCode,
      roleType: this.roleForm.value.roleType,
      txnType: this.roleForm.value.txnType,
      description: this.roleForm.value.description,
      menuGroup: this.selectedMenuGroups
    };
    
    if (roleData.menuGroup.length != 0) {
      this.roleDataService.save(roleData).subscribe(
        (data: { savedRoleObject: Object; description: string }) => {
          this.roleDataService
            .openDialog("success", data.description)
            .subscribe(result => {
              this.router.navigate(["roleManagement"]);
            });
        },
        err => {
          this.roleDataService
            .openDialog("error", err.error.description)
            .subscribe(result => {
              this.getMenuGroups(this.roleForm.value.applicationCode);
            });
        }
      );
    } else {
      this.roleDataService
        .openDialog("error", "Menus is a required field!")
        .subscribe(result => {
          this.getMenuGroups(this.roleForm.value.applicationCode);
        });
    }
  }

  getRoleTypes() {
    this.roleDataService
      .getLookUpCodeValues("ROLE_ROLETYPE")
      .subscribe((response: any) => {
        this.listOfRoleTypes = response.data.map(lookUp => lookUp.value);
      });
  }

  getTxtTypes() {
    this.roleDataService
      .getLookUpCodeValues("ROLE_TXNTYPE")
      .subscribe((response: any) => {
        this.listOfTxnTypes = response.data.map(lookUp => lookUp.value);
      });
  }

  // doIExist(title){
  //   return this.listOfSubMenuItems.includes(title);
  //   }

  toUpperCase(event){
    event.target.value = event.target.value.toUpperCase();
 }

}

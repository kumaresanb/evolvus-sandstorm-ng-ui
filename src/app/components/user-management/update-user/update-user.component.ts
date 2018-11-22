import { Component, OnInit } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { UserModel } from "./../user-model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserDataService } from "./../user-data.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-update-user",
  templateUrl: "./update-user.component.html",
  styleUrls: ["./update-user.component.css"]
})
export class UpdateUserComponent implements OnInit {
  userForm: FormGroup;
  selectedUserData: any;

  filteredEntityNames: Observable<string[]>;
  listOfEntityNames: string[] = [];
  listOfEntities: any;

  filteredRoleNames: Observable<string[]>;
  listOfRoleNames: string[] = [];
  listOfRoles: any;

  listOfMasterCurrency: any[] = [];
  loggedInUser: any;


  // listOfSubMenuItems: any = [];

  constructor(
    private userDataService: UserDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = new FormGroup({
      userId: new FormControl(""),
      userName: new FormControl(""),
      designation: new FormControl("", [Validators.minLength(6), Validators.maxLength(35), Validators.pattern("[a-zA-Z \-\]*")]),
      role: new FormControl("", [Validators.required]),
      entity: new FormControl("", [Validators.required]),
      emailId: new FormControl("", [Validators.required, Validators.email]),
      phoneNumber: new FormControl("", Validators.pattern("[0-9]{10}")),
      mobileNumber: new FormControl("",Validators.pattern("[0-9]{10}")),
      activationStatus: new FormControl('', Validators.compose([
        Validators.required
      ])),
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
      currency: new FormControl("", [Validators.required]),
      faxNumber: new FormControl("", [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]{10}")])
    });
  }

  ngOnInit() {
    var userName = "" + this.route.snapshot.params["id"];
    this.userDataService.getOneUserData(userName).subscribe(
      (response: any) => {
        var userData = response.data[0];

        if (userData.length != 0) {
          //If there is data with that Username

          this.selectedUserData = userData;
          this.userForm.patchValue({
            role: userData.role.roleName,
            applicationCode: userData.applicationCode,
            phoneNumber: userData.contact.phoneNumber,
            mobileNumber: userData.contact.mobileNumber,
            emailId: userData.contact.emailId,
            faxNumber: userData.contact.faxNumber,
            userId: userData.userId,
            userName: userData.userName,
            activationStatus: userData.activationStatus,
            individualTransactionLimit: userData.individualTransactionLimit,
            dailyLimit: userData.dailyLimit,
            currency: userData.masterCurrency,
            designation: userData.designation,
            state: userData.contact.state,
            country: userData.contact.country,
            city: userData.contact.city
          });

          this.userDataService
            .getAllMasterCurrency()
            .subscribe((response: any) => {
              if (response.data.length != 0) {
                this.listOfMasterCurrency = response.data;
              }
            });
          this.userDataService.getAllEntities().subscribe((response: any) => {
            this.listOfEntities = response.data;
            if (response.data != 0) {
              this.listOfEntityNames = this.listOfEntities.map(
                entity => entity.name
              );
              var selectedEntity = this.listOfEntities.filter(
                entity => entity.entityId == this.selectedUserData.entityId
              );
                   this.getFilteredEntityNames();
                    this.userForm.patchValue({
                      entity: selectedEntity[0].name
                    });

            }
          });
          this.userDataService
            .getAllRoleData(0, 1)
            .subscribe((response: any) => {
              if(response.data.length!=0){
                this.listOfRoles = response.data;
                this.listOfRoleNames = this.listOfRoles.map(role=>role.roleName)
              }
              this.getFilteredRoleNames();
            });
        } else {
          //If there is no data with that Username
          this.userDataService
            .openDialog("error", "No User found with Username " + userName!)
            .subscribe(response => {
              this.router.navigate(["userManagement"]);
            });
        }
      },
      err => {
        //If there is any error
        this.userDataService
          .openDialog("error", err.error.description)
          .subscribe(response => {
            this.router.navigate(["userManagement"]);
          });
      }
    );
    this.loggedInUser = this.userDataService.getCurrentUserData();
  }

  update() {

    if(this.isAValidSelection('entity', this.userForm.value.entity)){
      if(this.isAValidSelection('role', this.userForm.value.role)){
        this.userDataService
        .update(
          this.userForm,
          this.listOfRoles,
          this.listOfEntities,
          this.listOfMasterCurrency
        )
        .subscribe(
          (response: {
            savedEntityObject: Object;
            description: string;
            status: string;
          }) => {
            this.userDataService
              .openDialog("success", response.description)
              .subscribe(result => {
                this.router.navigate(["userManagement"]);
              });
          },
          err => {
            this.userDataService
              .openDialog("error", err.error.description + ".")
              .subscribe(result => {});
          }
        );
      }else{
        this.userDataService
        .openDialog("error", "Please Select a Valid Role" + ".")
        .subscribe(result => {
          // Dialog Response can be handled here
        });
      }
    }else{
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

  abortUpdateAction() {
    // var tempStatus = "";
    // if(this.roleForm.touched){
    //   tempStatus = this.roleDataService.openDialog("alert", "All the changes will be discarded, click OK to continue!");
    //   if(tempStatus === "success"){
    this.router.navigate(["userManagement"]);
    // }
    // }else{
    //   this.router.navigate(['viewRole', this.roleData.roleName]);
    // }
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
}

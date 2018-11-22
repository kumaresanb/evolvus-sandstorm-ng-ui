import { Router } from "@angular/router";
import { RoleModel } from "../role-model";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { RoleDataService } from "../role-data.service";
import { Pipe } from "@angular/core";

@Component({
  selector: "app-list-roles-entity",
  templateUrl: "./list-roles-entity.component.html",
  styleUrls: ["./list-roles-entity.component.css"]
})
export class ListRolesEntityComponent implements OnInit {
  tableHeader: any = [];
  role: RoleModel;
  listOfRoles: any;
  listOfApplicationCategory: string[] = [];
  listOfApplications: any []= [];
  defaultFilterCriteria = {
    applicationCode: "",
    activationStatus: "",
    processingStatus: "PENDING_AUTHORIZATION",
    pageSize: 5,
    pageNo: 1
  };
  isViewAllOptionSelected: boolean = false;
  noRoleDataMessage: string = "";
  noOfRolesInCurrentPage: number = 0;
  pageSize: number = 5;
  pageNo: number = 1;
  totalNoOfPages: number = 0;
  totalNoOfRoles: number = 0;
  startIndex: number = 1;
  user: any;   //currently loggedIn User

  constructor(
    private roleDataService: RoleDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.tableHeader = this.roleDataService.getTableHeaders();
    this.defaultFilterCriteria = this.roleDataService.getDefaultFilterCriteria();
    this.getApplicationCodes();
    this.getRoleDataBasedOnDefaultFilterCriteria();
    this.roleDataService.getCurrentUserData().subscribe((user: any)=>{
      this.user = user;   
    });
  }

  getApplicationCodes() {
    this.roleDataService
      .getlistOfApplicationCategory()
      .subscribe((response: any) => {
        if(response!=null){
          this.listOfApplications = response.data;
          this.listOfApplicationCategory = this.listOfApplications.map(application => application.applicationCode);
        }
      });
  }

  getRoleData() {
    this.roleDataService.getAllRoleData(this.pageSize, this.pageNo).subscribe(
      (response: any) => {
        if (response.totalNoOfRecords != 0) {
          this.listOfRoles = response.data;
          this.totalNoOfRoles = response.totalNoOfRecords;
          this.totalNoOfPages = response.totalNoOfPages;
          this.setCurrentPage(0);
        } else {
          this.noRoleDataMessage = "No Role Details Found!";
        }
      },
      err => {
        this.roleDataService
          .openDialog("error", err.error.description)
          .subscribe(result => {});
      }
    );
  }

  checkBoxTicked(value) {
    this.isViewAllOptionSelected = !this.isViewAllOptionSelected;
    if (value) {
      this.startIndex = 1;
      this.pageNo = 1;
      this.getRoleData();
    } else {
      this.getFilteredRoleData("filter");
    }
  }

  view(role: RoleModel) {
    this.reset('ts'); 
    this.router.navigate(["viewRole", role.roleName]);
  }

  getRoleDataBasedOnDefaultFilterCriteria() {
    this.roleDataService 
      .getFilteredRoleData(
        this.defaultFilterCriteria.applicationCode,
        this.defaultFilterCriteria.activationStatus,
        this.defaultFilterCriteria.processingStatus,
        this.defaultFilterCriteria.pageSize,
        this.defaultFilterCriteria.pageNo
      )
      .subscribe(
        (response: any) => {
          if (response.data.length == 0) {
            this.defaultFilterCriteria.processingStatus = "AUTHORIZED";

            this.roleDataService
              .getFilteredRoleData(
                this.defaultFilterCriteria.applicationCode,
                this.defaultFilterCriteria.activationStatus,
                this.defaultFilterCriteria.processingStatus,
                this.defaultFilterCriteria.pageSize,
                this.defaultFilterCriteria.pageNo
              )
              .subscribe((response: any) => {
                this.listOfRoles = response.data;
                this.totalNoOfRoles = response.totalNoOfRecords;
                this.totalNoOfPages = response.totalNoOfPages;
                this.startIndex = 1;
                this.setCurrentPage(0);
              });
          } else {
            this.listOfRoles = response.data;
            this.totalNoOfRoles = response.totalNoOfRecords;
            this.totalNoOfPages = response.totalNoOfPages;
            this.startIndex = 1;
            this.setCurrentPage(0);
          }
        },
        err => {
          this.roleDataService
            .openDialog("error", err.error.description)
            .subscribe(result => {
              // console.log("Server Down");
            });
        }
      );
  }

  setCurrentPage(movement: number) {
    if (movement == 1) {
      //next page
      this.pageNo = this.pageNo + 1;

      if (this.isViewAllOptionSelected) {
        this.getRoleData();
      } else {
        this.getFilteredRoleData("");
      }
      this.startIndex = this.pageSize * (this.pageNo - 1) + 1;
    } else if (movement == -1 && this.pageNo > 1) {
      //prev page
      this.pageNo = this.pageNo - 1;
      if (this.isViewAllOptionSelected) {
        this.getRoleData();
      } else {
        this.getFilteredRoleData("");
      }
      this.startIndex = this.startIndex - this.pageSize;
    } else if (movement == 0) {
      //only for pagination purpose
      if (this.listOfRoles.length == this.pageSize) {
        this.noOfRolesInCurrentPage = this.pageSize * this.pageNo;
      } else {
        this.noOfRolesInCurrentPage = this.totalNoOfRoles;
      }
    }
  }

  setPageSize() {
    this.pageNo = 1;
    this.startIndex = 1;
    if (this.isViewAllOptionSelected) {
      this.getRoleData();
    } else {
      this.getFilteredRoleData("");
    }
  }

  getFilteredRoleData(source) {
    if (source == "filter") {
      this.pageNo = 1;
      this.startIndex = 1;
    }
    this.listOfRoles = [];

    this.roleDataService
      .getFilteredRoleData(
        this.defaultFilterCriteria.applicationCode,
        this.defaultFilterCriteria.activationStatus,
        this.defaultFilterCriteria.processingStatus,
        this.pageSize,
        this.pageNo
      )
      .subscribe(
        (response: any) => {
          this.listOfRoles = response.data;
          this.totalNoOfRoles = response.totalNoOfRecords;
          this.totalNoOfPages = response.totalNoOfPages;
          this.setCurrentPage(0);
        },
        err => {
          this.roleDataService
            .openDialog("error", err.error.description)
            .subscribe(result => {});
        }
      );
  }

  reset(source){
    this.defaultFilterCriteria.pageNo=1;
    this.defaultFilterCriteria.pageSize=5;
    this.defaultFilterCriteria.activationStatus=undefined;
    this.defaultFilterCriteria.processingStatus="PENDING_AUTHORIZATION";  
    this.defaultFilterCriteria.applicationCode=undefined; 
    if(source=='html'){
     this.getRoleDataBasedOnDefaultFilterCriteria();
     this.isViewAllOptionSelected = false;
    }  
  }
}

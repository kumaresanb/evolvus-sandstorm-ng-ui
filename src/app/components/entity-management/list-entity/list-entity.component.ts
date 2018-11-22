import { EntityDataService } from "./../entity-data.service";
import { EntityModel } from "./../entity.model";
import { Component, OnInit } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-list-entity",
  templateUrl: "./list-entity.component.html",
  styleUrls: ["./list-entity.component.css"]
})
export class ListEntityComponent implements OnInit {
  platformURL = environment.platformURL;
  isViewAllOptionSelected: boolean = false;
  listOfParentEntities: string[] = [];
  tableHeader: any[];
  listOfEntities: any[]; 
  defaultFilterCriteria = {
    parent: "",
    activationStatus: "",
    processingStatus: "",
    pageSize: 5,
    pageNo: 1
  };
  noEntityDataMessage: string = "";
  noOfEntitiesInCurrentPage: number = 0;
  pageSize: number = 5;
  pageNo: number = 1;
  totalNoOfPages: number = 1;
  totalNoOfEntities: number = 0;
  startIndex: number = 1;
  user: any;
  isViewAllChecked: boolean = false;
  constructor(
    private router: Router,
    private entityService: EntityDataService
  ) {}

  ngOnInit() {
    this.tableHeader = this.entityService.getTableHeaders();  
    this.defaultFilterCriteria.processingStatus = "PENDING_AUTHORIZATION";    
    this.defaultFilterCriteria = this.entityService.getDefaultFilterCriteria();
    this.getListOfEntities();
    this.getEntityDataBasedOnDefaultFilterCriteria();
    this.entityService.getCurrentUserData().subscribe((user: any)=>{
      this.user = user;   
    }, (err)=>{
      alert("I am throwing error");
    });
    // this.entityService.menuItemCode = 
  }

  getListOfEntities() {
    this.entityService.getAllEntities(0, 1).subscribe((response: any) => {
      this.listOfParentEntities = response.data;
    },(err)=>{
      // handle error
    });
  }

  getEntityDataBasedOnDefaultFilterCriteria() {
    // this.listOfEntities = [];  
    this.entityService
      .getFilteredEntityData(
        this.defaultFilterCriteria.parent,
        this.defaultFilterCriteria.activationStatus,
        this.defaultFilterCriteria.processingStatus,
        this.defaultFilterCriteria.pageSize,
        this.defaultFilterCriteria.pageNo
      )
      .subscribe(
        (response: any) => {
          if(response!=null){ 
            if (response.totalNoOfRecords == 0) {
              this.defaultFilterCriteria.processingStatus = "AUTHORIZED";
  
              this.entityService
                .getFilteredEntityData(
                  this.defaultFilterCriteria.parent,
                  this.defaultFilterCriteria.activationStatus,
                  this.defaultFilterCriteria.processingStatus,
                  this.defaultFilterCriteria.pageSize,
                  this.defaultFilterCriteria.pageNo
                )
                .subscribe(
                  (response: any) => {
                    this.listOfEntities = response.data;
                    this.totalNoOfEntities = response.totalNoOfRecords;
                    this.totalNoOfPages = response.totalNoOfPages;
                    this.startIndex = 1;
                    this.setCurrentPage(0);
                  },
                  err => {
                    this.noEntityDataMessage = "Server Error! Try Again Later!";
                  }
                );
            } else {
              this.listOfEntities = response.data;
              this.totalNoOfEntities = response.totalNoOfRecords;
              this.totalNoOfPages = response.totalNoOfPages;
              this.startIndex = 1;
              this.setCurrentPage(0);
            }
          }
        },
        err => {
          this.entityService
            .openDialog("error", "Unexpected Error : Please Try Again")
            .subscribe(result => {
              // console.log(err, "Server Down");
            });
        }
      );
  }
  getAllEntityData() {
    this.entityService.getAllEntities(this.pageSize, this.pageNo).subscribe(
      (response: any) => {
        this.listOfEntities = response.data;
        this.totalNoOfEntities = response.totalNoOfRecords;
        this.totalNoOfPages = response.totalNoOfPages;
        this.setCurrentPage(0);
      },
      err => {
        this.startIndex = 0;
        this.noEntityDataMessage = "Server Error! Try Again Later!";
      }
    );
  }

  getFilteredEntityData(source) {
    if (source == "filter") {
      this.pageNo = 1;
      this.startIndex = 1;
    }
    this.listOfEntities = [];
    this.entityService
      .getFilteredEntityData(
        this.defaultFilterCriteria.parent,
        this.defaultFilterCriteria.activationStatus,
        this.defaultFilterCriteria.processingStatus,
        this.pageSize,
        this.pageNo
      )
      .subscribe((response: any) => {
        this.listOfEntities = response.data;
        this.totalNoOfEntities = response.totalNoOfRecords;
        this.totalNoOfPages = response.totalNoOfPages;
        this.setCurrentPage(0);
      });
  }

  checkBoxTicked(value) {
    this.isViewAllOptionSelected = !this.isViewAllOptionSelected;
    if (value) {
      this.startIndex = 1;
      this.pageNo = 1;
      this.getAllEntityData();
    } else {
      this.getFilteredEntityData("filter");
    }
  }

  view(entity) {
    this.reset('ts');
    this.router.navigate(["viewEntity", entity.entityCode]);
  }

  setCurrentPage(movement: number) {
    if (movement == 1) {
      //next page
      this.pageNo = this.pageNo + 1;
      if (this.isViewAllOptionSelected) {
    

        this.getAllEntityData();
      } else {
        this.getFilteredEntityData("");
      }
      this.startIndex = this.pageSize * (this.pageNo - 1) + 1;
    } else if (movement == -1 && this.pageNo > 1) {
      //prev page
      this.pageNo = this.pageNo - 1;
      if (this.isViewAllOptionSelected) {
        this.getAllEntityData();
      } else {
        this.getFilteredEntityData("");
      }
      this.startIndex = this.startIndex - this.pageSize;
    } else if (movement == 0) {
      if (this.listOfEntities.length == this.pageSize) {
        this.noOfEntitiesInCurrentPage = this.pageSize * this.pageNo;
      } else {
        this.noOfEntitiesInCurrentPage = this.totalNoOfEntities;
      }
    }
  }

  setPageSize() {
    this.pageNo = 1;
    this.startIndex = 1;
    if (this.isViewAllOptionSelected) {
      this.getAllEntityData();
    } else {
      this.getFilteredEntityData("");
    }
  }

  reset(source){
    this.defaultFilterCriteria.pageNo=1;
    this.defaultFilterCriteria.pageSize=5;
    this.defaultFilterCriteria.activationStatus=undefined;
    this.defaultFilterCriteria.processingStatus="PENDING_AUTHORIZATION";  
    this.defaultFilterCriteria.parent=undefined;
    if(source=='html'){
     this.getEntityDataBasedOnDefaultFilterCriteria();
     this.isViewAllOptionSelected = false;
    }
  }


}

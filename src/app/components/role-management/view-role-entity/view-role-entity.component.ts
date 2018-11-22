import { RoleModel } from "./../role-model";
import { Router, ActivatedRouteSnapshot } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RoleDataService } from "../role-data.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatMenuTrigger } from "@angular/material";

@Component({
  selector: "app-view-role-entity",
  templateUrl: "./view-role-entity.component.html",
  styleUrls: ["./view-role-entity.component.css"]
})
export class ViewRoleEntityComponent implements OnInit {
  selectedRole: any;
  isStatusPending: boolean = true;
  user: any = {};
  listOfSubMenuItems: any = [];
  showWorkFlow: boolean = false;
  listOfEvents: any[] = [];
  comments: string = "";
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  isPanelOpened: boolean = false;
  panelOpenState: boolean =false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roleDataService: RoleDataService
  ) {}

  ngOnInit() {
    var roleName = this.route.snapshot.params["id"];
    this.roleDataService.getOneRoleData(roleName).subscribe((response: any) => {
      if (response.data.length != 0) {
        this.selectedRole = response.data[0];
        if (this.selectedRole.processingStatus != "PENDING_AUTHORIZATION") {
          this.isStatusPending = false;
        } else {
          this.isStatusPending = true;
        }
      }
    }); 
    this.roleDataService.getCurrentUserData().subscribe((user: any) => {
      this.user = user;
    });
    this.listOfSubMenuItems = this.roleDataService.getListOfSubMenuItems();
  }

  updateRole() {
    if (!this.isStatusPending) {
      this.router.navigate(["updateRole", this.selectedRole.roleName]);
    }
  }

  doIExist(title) {
    return this.listOfSubMenuItems.includes(title);
  }

  abortViewAction() {
    this.router.navigate(["roleManagement"]);
  }

  getWorkFlowData() {
    if (!this.showWorkFlow) {
      this.roleDataService
        .getWorkFlowData(this.selectedRole._id)
        .subscribe((response: any) => {
          this.showWorkFlow = !this.showWorkFlow;
          if (response != null) {
            this.listOfEvents = response.data;
          }
        });
    } else {
      this.showWorkFlow = !this.showWorkFlow;
    }
  }

  takeAction(type) {
    this.roleDataService
      .openDialog("comments", "comments")
      .subscribe(result => {
        if (result.status) {
          this.comments = result.comments;
          this.roleDataService
            .takeAction(type, this.selectedRole, this.comments)
            .subscribe((response: any) => {
              this.roleDataService
            .openDialog("success", response.description)
            .subscribe(result => {
              this.router.navigate(["roleManagement"]);
            });
            }, (err)=>{
              this.roleDataService
            .openDialog("error", err.description)
            .subscribe(result => {
            });
            });
        } else {
        }
      });
  }

  log(){
   this.trigger.openMenu();
  }
  panelOpened(){

    this.isPanelOpened = !this.isPanelOpened;
}
}

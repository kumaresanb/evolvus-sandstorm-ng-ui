import { Observable, Subject, of } from "rxjs";
import { Injectable, OnInit } from "@angular/core";
import { RoleModel } from "./role-model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map } from "rxjs/operators";
import { ConfirmationDialogEntityComponent } from "../../shared/confirmation-dialog-entity/confirmation-dialog-entity.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SandstormGlobalVariablesService } from "../../shared/sandstorm-global-variables.service";

@Injectable({
  providedIn: "root"
})
export class RoleDataService {

  currentLoggedInUserData: any = {};
  menuItemCode: string = "roleManagement";
  currentUser = new Subject<Object>();
  platformURL = environment.platformURL;
  listOfApplicationCategory: string[] = [];
  dialogClosed: Subject<boolean> = new Subject<boolean>();
  roleTableHeaders = [
    "Role Name",
    "Application Category",
    "Activation Status",
    "Processing Status",
    "Created By",
    "Last Modified Date Time"
  ];
  defaultFilterCriteria = {
    applicationCode: undefined,
    activationStatus: undefined,
    processingStatus: "PENDING_AUTHORIZATION",
    pageSize: 5,
    pageNo: 1
  };

  sampleDate: Date = new Date();

  roleData: RoleModel[] = [];


  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private globalVariablesService: SandstormGlobalVariablesService
  ) {
    this.currentLoggedInUserData = this.globalVariablesService.currentUser.getValue();



  }



  createNewRole(role: RoleModel) {
    this.roleData.push(role);
  }

  getAllRoleData(pageSize, pageNo) {
    return this.http.get(`${this.platformURL}/sandstorm/api/role`, {
      params: {
        pageSize: pageSize,
        pageNo: pageNo
      }
    });
  }

  getlistOfApplicationCategory() {
    return this.http.get(`${this.platformURL}/sandstorm/api/application`, {
      params: {
        processingStatus: "AUTHORIZED"
      }
    });
  }

  getTableHeaders() {
    return this.roleTableHeaders;
  }

  getDefaultFilterCriteria() {
    return this.defaultFilterCriteria;
  }

  getListOfMenuGroups(applicationCode: string) {
    return this.http.get(`${this.platformURL}/sandstorm/api/menu`, {
      params: {
        applicationCode: applicationCode
      }
    });
  }

  getOneRoleData(roleName: string) {
    return this.http.get(`${this.platformURL}/sandstorm/api/role`, {
      params: {
        roleName: roleName
      }
    });
  }

  getFilteredRoleData(
    applicationCode,
    activationStatus,
    processingStatus,
    pageSize,
    pageNo
  ) {
    return this.http.get(`${this.platformURL}/sandstorm/api/role`, {
      params: {
        applicationCode: applicationCode,
        activationStatus: activationStatus,
        processingStatus: processingStatus,
        pageSize: pageSize,
        pageNo: pageNo
      }
    });
  }

  save(roleData) {
    return this.http.post(`${this.platformURL}/sandstorm/api/role`, roleData);
  }
  update(roleData) {
    return this.http.put(
      `${this.platformURL}/sandstorm/api/role/` + roleData.roleName,
      roleData
    );
  }
  deleteRole(roleData) {
    return this.http.put(
      `${this.platformURL}/sandstorm/api/role/delete/` + roleData.roleName,
      {
        roleData: roleData
      }
    );
  }

  getLookUpCodeValues(lookupCode) {
    return this.http.get(`${this.platformURL}/sandstorm/api/lookup/`, {
      params: {
        lookupCode: lookupCode
      }
    });
  }

  getCurrentUserData() {
    return of(this.currentLoggedInUserData);
  }

  openDialog(messageType, statusMessage): any {
    let dialogRef = this.dialog.open(ConfirmationDialogEntityComponent, {
      width: "300px",
      data: {
        message: statusMessage,
        type: messageType
      }
    });

    return dialogRef.afterClosed();
  }

  getListOfSubMenuItems() {
    return this.currentLoggedInUserData.role.menuGroup
      .map(menuGroup => menuGroup.menuItems)
      .reduce((menuItemsA, menuItemsC) => menuItemsA.concat(menuItemsC), [])
      .filter(menuItem => menuItem.menuItemCode == "roleManagement")
      .map(menuItem => menuItem.subMenuItems)
      .reduce(
        (subMenuItemsA, subMenuItemsC) => subMenuItemsA.concat(subMenuItemsC),
        []
      )
      .map(subMenuItem => subMenuItem.title);
  }

  getWorkFlowData(id) {
    return this.http.get(`${this.platformURL}/swe/api/event`, {
      params: {
        query: id,
        sort: "+wfEventDate"

      }
    });
  }

  takeAction(type, role, comments) {
    if(type=='APPROVE'){
      type="AUTHORIZED";
    }else if(type=='REJECT'){
      type="REJECTED"
    }
    return this.http.post(`${this.platformURL}/swe/api/swe/complete`, {
      wfInstanceId: role.wfInstanceId,
      wfEntity: "ROLE",
      wfEvent: type,
      query: role._id,
      comments: comments
    });
  }
}

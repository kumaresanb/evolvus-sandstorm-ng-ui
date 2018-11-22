import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ConfirmationDialogEntityComponent } from "../../shared/confirmation-dialog-entity/confirmation-dialog-entity.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SandstormGlobalVariablesService } from "../../shared/sandstorm-global-variables.service";
import { of } from "rxjs";

@Injectable()
export class EntityDataService {
  platformURL = environment.platformURL;
  entityTableHeaders = [
    "Entity Name",
    "Parent Entity Name",
    "Entity Code",
    "Activation Status",
    "Processing Status",
    "Created By",
    "Last Modified Date Time"
  ];
  defaultHeaders: HttpHeaders;
  defaultFilterCriteria = {
    parent: undefined,
    activationStatus: undefined,
    processingStatus: "PENDING_AUTHORIZATION",
    pageSize: 5,
    pageNo: 1
  };
  currentLoggedInUserData: any = {};
  menuItemCode: string = "entityManagement";
  constructor(
    public http: HttpClient,
    private dialog: MatDialog,
    private globalVariablesService: SandstormGlobalVariablesService
  ) {
    this.defaultHeaders = new HttpHeaders({
      entityId: "HOO1BOO1",
      tenantId: "T001",
      accessLevel: "0"
    });


    this.currentLoggedInUserData = this.globalVariablesService.currentUser.getValue();

  }

  getListOfSubMenuItems() {
    return this.currentLoggedInUserData.role.menuGroup
      .map(menuGroup => menuGroup.menuItems)
      .reduce((menuItemsA, menuItemsB) => menuItemsA.concat(menuItemsB), [])
      .filter(menuItem => menuItem.menuItemCode == "entityManagement")
      .map(menuItem => menuItem.subMenuItems)
      .reduce(
        (subMenuItemsA, subMenuItemsB) => subMenuItemsA.concat(subMenuItemsB),
        []
      )
      .map(subMenuItem => subMenuItem.title);
  }

  getCurrentUserData() {
    return of(this.currentLoggedInUserData);
  }

  getFilteredEntityData(
    parent,
    activationStatus,
    processingStatus,
    pageSize,
    pageNo
  ) {
    return this.http.get(`${this.platformURL}/sandstorm/api/entity`, {
      params: {
        parent: parent,
        activationStatus: activationStatus,
        processingStatus: processingStatus,
        pageSize: pageSize,
        pageNo: pageNo
      }
    });
  }

  getParentEntities() {
    return this.http.get(`${this.platformURL}/sandstorm/api/entity`, {
      params: {
        processingStatus: "AUTHORIZED",
        activationStatus: "ACTIVE"
      }
    });
  }

  getAllEntities(pageSize, pageNo) {
    return this.http.get(`${this.platformURL}/sandstorm/api/entity`, {
      params: {
        pageSize: pageSize,
        pageNo: pageNo
      }
    });
  }

  getOneEntityData(entityId) {
    return this.http.get(`${this.platformURL}/sandstorm/api/entity`, {
      params: {
        entityCode: entityId
      }
    });
  }

  save(entityData) {
    return this.http.post(
      `${this.platformURL}/sandstorm/api/entity`,
      entityData
    );
  }

  update(entityData) {
    return this.http.put(
      `${this.platformURL}/sandstorm/api/entity/` + entityData.entityCode,
      entityData
    );
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

  getTableHeaders() {
    return this.entityTableHeaders;
  }

  getDefaultFilterCriteria() {
    return this.defaultFilterCriteria;
  }

  getBooleanValue(attribute) {
    if (attribute == "true") {
      attribute = true;
    } else if (attribute == "false") {
      attribute = false;
    }
    return attribute;
  }

  getWorkFlowData(id) {
    return this.http.get(`${this.platformURL}/swe/api/event`, {
      params: {
        query: id,
        sort: "+wfEventDate"
      }
    });
  }

  takeAction(type, entity, comments) {
    if (type == "APPROVE") {
      type = "AUTHORIZED";
    } else if (type == "REJECT") {
      type = "REJECTED";
    }
    return this.http.post(`${this.platformURL}/swe/api/swe/complete`, {
      wfInstanceId: entity.wfInstanceId,
      wfEntity: "ENTITY",
      wfEvent: type,
      query: entity._id,
      comments: comments
    });
  }
}

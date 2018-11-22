import { EntityModel } from "./../entity-management/entity.model";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map } from "rxjs/operators";
import { ConfirmationDialogEntityComponent } from "../../shared/confirmation-dialog-entity/confirmation-dialog-entity.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { of, BehaviorSubject } from 'rxjs';
import { SandstormGlobalVariablesService } from '../../shared/sandstorm-global-variables.service';

@Injectable({
  providedIn: "root"
})
export class UserDataService {
  platformURL = environment.platformURL;

  userTableHeaders = [
    "User Id",
    "User Name",
    "Login Status",
    "Activation Status",
    "Processing Status",
    "User Role",
    "Last Updated Date"
  ];
  defaultFilterCriteria = {
    userLoginStatus: undefined,
    activationStatus: undefined,
    processingStatus: "PENDING_AUTHORIZATION",
    pageSize: 5,
    pageNo: 1
  };
  menuItemCode: string = "userManagement";
  currentLoggedInUserData: any = {};
  filterCriteria = new BehaviorSubject<Object>(this.defaultFilterCriteria);



  constructor(private http: HttpClient, private dialog: MatDialog, private globalVariablesService: SandstormGlobalVariablesService) {
    this.getCurrentUserData().subscribe((response: any)=>{
      this.currentLoggedInUserData = response;
    })
  }

  getTableHeaders() {
    return this.userTableHeaders;
  }

  getDefaultFilterCriteria() {
    this.filterCriteria.next(this.defaultFilterCriteria);
  }

  getAllTimeZones() {
    return this.http.get(`${this.platformURL}/sandstorm/api/masterTimeZone`);
  }
  getAllMasterCurrency() {
    return this.http.get(`${this.platformURL}/sandstorm/api/masterCurrency`);
  }
  getAllEntities() {
    return this.http.get(`${this.platformURL}/sandstorm/api/entity`,{
      params:{
        processingStatus: 'AUTHORIZED'
      }
    });
  }

  getAllRoleData(pageSize, pageNo) {
    return this.http.get(`${this.platformURL}/sandstorm/api/role`,{
      params:{
        processingStatus: 'AUTHORIZED',
        activationStatus: 'ACTIVE'
      }
      });
  }
  getAllUserData(pageSize, pageNo) {
    return this.http.get(`${this.platformURL}/sandstorm/api/user`, {
      params: {
        pageSize: pageSize,
        pageNo: pageNo
      }
    });
  }

  save(userForm, listOfRoles, listOfEntities, listOfMasterCurrency) {
    var user = this.createUserObject(
      userForm,
      listOfRoles,
      listOfEntities,
      listOfMasterCurrency
    );
    return this.http.post(`${this.platformURL}/sandstorm/api/user`, user, {});
  }

  update(userForm, listOfRoles, listOfEntities, listOfMasterCurrency) {
    var user = this.createUserObject(
      userForm,
      listOfRoles,
      listOfEntities,
      listOfMasterCurrency
    );
    return this.http.put(
      `${this.platformURL}/sandstorm/api/user/` + user.userId,
      user
    );
  }

  private createUserObject(
    userForm,
    listOfRoles,
    listOfEntities,
    listOfMasterCurrency
  ): any {

    var selectedRole = listOfRoles.filter(
      role => role.roleName == userForm.controls.role.value
    );
    var selectedEntity = listOfEntities.filter(
      entity => entity.name == userForm.controls.entity.value
    );
    var selectedMasterCurrency = listOfMasterCurrency.filter(
      masterCurrency =>
        masterCurrency.currencyName == userForm.controls.currency.value
    );
    var userData = {
      userName: userForm.value.userName,
      userId: userForm.value.userId,
      designation: userForm.value.designation,
      role: selectedRole[0],
      entityId: selectedEntity[0].entityId,
      activationStatus: userForm.value.activationStatus,
      masterCurrency: userForm.value.currency,
      contact: {
        phoneNumber: userForm.value.phoneNumber,
        mobileNumber: userForm.value.mobileNumber,
        faxNumber: userForm.value.faxNumber,
        city: userForm.value.city,
        state: userForm.value.state,
        country: userForm.value.country,
        emailId: userForm.value.emailId
      },
      individualTransactionLimit: userForm.value.individualTransactionLimit,
      dailyLimit: userForm.value.dailyLimit
    };

    return userData;
  }

  getCurrentUserData(){
   return this.globalVariablesService.currentUser;
    }




  getFilteredUserData(
    userLoginStatus,
    activationStatus,
    processingStatus,
    pageSize,
    pageNo
  ) {
    return this.http.get(`${this.platformURL}/sandstorm/api/user`, {
      params: {
        loginStatus: userLoginStatus,
        activationStatus: activationStatus,
        processingStatus: processingStatus,
        pageSize: pageSize,
        pageNo: pageNo
      }
    });
  }

  getOneUserData(userId) {
    return this.http.get(`${this.platformURL}/sandstorm/api/user`, {
      params: {
        userId: userId
      }
    });
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

  getListOfSubMenuItems(){

      return this.currentLoggedInUserData.role.menuGroup.map(menuGroup => menuGroup.menuItems)
      .reduce((menuItemsA, menuItemsC) => menuItemsA.concat(menuItemsC), [])
      .filter(menuItem => menuItem.menuItemCode == 'userManagement')
      .map(menuItem => menuItem.subMenuItems)
      .reduce((subMenuItemsA, subMenuItemsC) => subMenuItemsA.concat(subMenuItemsC), [])
      .map(subMenuItem => subMenuItem.title);

  }

  getWorkFlowData(id){
    return this.http.get(`${this.platformURL}/swe/api/event`, {
      params: {
        query: id,
        sort: "+wfEventDate"
      }
    });  }

    takeAction(type, user, comments) {
      console.log('type', type);

      if(type=='APPROVE'){
        type="AUTHORIZED";
      }else if(type=='REJECT'){
        type="REJECTED"
      }
      return this.http.post(`${this.platformURL}/swe/api/swe/complete`, {
        wfInstanceId: user.wfInstanceId,
        wfEntity: "USER",
        wfEvent: type,
        query: user._id,
        comments: comments
      });
    }



}

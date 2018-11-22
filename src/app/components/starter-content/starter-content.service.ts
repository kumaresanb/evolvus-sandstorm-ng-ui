import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfirmationDialogEntityComponent } from "../../shared/confirmation-dialog-entity/confirmation-dialog-entity.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SandstormGlobalVariablesService } from '../../shared/sandstorm-global-variables.service';
import { environment } from '../../../environments/environment';
import { RoleDataService } from '../role-management/role-data.service';
import { EntityDataService } from './../entity-management/entity-data.service';
import { UserDataService } from './../user-management/user-data.service';
import { ApplicationDataService } from './../application-management/application-data.service';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StarterContentService {


platformURL = environment.platformURL;

    

  constructor(private http: HttpClient, private dialog: MatDialog, private globalVariablesService: SandstormGlobalVariablesService,
  private roleDataService: RoleDataService, private entityDataService: EntityDataService, private applicationDataService: ApplicationDataService,
  private userDataService: UserDataService
  
  ) {
  }


getSWEEventData(){

  return this.http.get(`${this.platformURL}/swe/api/event`,{
    params:{
      wfInstanceStatus: 'PENDING_AUTHORIZATION'
    }
  });

}





getWfEntityData(wfEntity, id){
  wfEntity = wfEntity.toLowerCase();
  return this.http.get(`${this.platformURL}/sandstorm/api/${wfEntity}`,{
    params:{
      _id : id
    }
  });
}

}

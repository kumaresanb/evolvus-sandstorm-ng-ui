import { ConfirmationDialogEntityComponent } from './../../shared/confirmation-dialog-entity/confirmation-dialog-entity.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Injectable({
  providedIn: 'root'
})
export class ApplicationDataService {


  platformURL = environment.platformURL;


  constructor(private http: HttpClient, private dialog: MatDialog) { }


getAllApplications(){
 return this.http.get(`${this.platformURL}/sandstorm/api/application`);
}


getOneApplication(applicationCode){
 return this.http.get(`${this.platformURL}/sandstorm/api/application`, {
    params: {
      applicationCode: applicationCode
    }
  });

}

save(applicationData){
  return this.http.post(`${this.platformURL}/sandstorm/api/application`,
  applicationData);
}

update(applicationData){
  return this.http.put(`${this.platformURL}/sandstorm/api/application/` + applicationData.applicationCode, applicationData);

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



}

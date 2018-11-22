import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfirmationDialogEntityComponent } from "../../../shared/confirmation-dialog-entity/confirmation-dialog-entity.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
@Injectable({
  providedIn: 'root'
})
export class BulkUploadService {

platformURL = environment.platformURL;

  constructor(private http: HttpClient, private dialog: MatDialog) { }


getListOfFileTypes(){
  return this.http.get(`${this.platformURL}/sandstorm/api/lookup`, {
    params:{
      lookupCode: "FILE_UPLOAD_CONSOLE"
    }
  });
}

upload(file, lookupCode, value)
{ 
  const formData = new FormData();
  formData.append('file', file);
  formData.append('lookupCode', lookupCode);
  formData.append('value', value);
   return this.http.post(`${this.platformURL}/bulkupload/api/v0.1/upload`,formData);
}

openDialog(messageType, statusMessage): any {
  let dialogRef = this.dialog.open(ConfirmationDialogEntityComponent, {
    width: "300px",
    data: {
      message: statusMessage,
      type: messageType
    }
  });
}

}
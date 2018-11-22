import { ApplicationDataService } from "./../application-data.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-save-application-entity",
  templateUrl: "./save-application-entity.component.html",
  styleUrls: ["./save-application-entity.component.css"]
})
export class SaveApplicationEntityComponent implements OnInit {
  platformURL = environment.platformURL;
  logoFile: File = null;
  faviconFile: File = null;
  logoInBase64: string = "";
  faviconInBase64: string = "";
  logoUrl: any;
  faviconUrl: any;
  applicationSuccessfullySaved: boolean = undefined;
  application: any;
  applicationForm: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private applicationDataService: ApplicationDataService
  ) {
    this.applicationForm = new FormGroup({
      applicationName: new FormControl(""),
      applicationCode: new FormControl(""),
      description: new FormControl(""),
      enableFlag: new FormControl("")
    });
  }


  ngOnInit() {}

  logoUpload(file: FileList) {
    this.logoFile = file.item(0);
    var reader = new FileReader();
    reader.readAsDataURL(this.logoFile);
    let logoFileName = this.logoFile.name;
    reader.onload = e => {
      this.logoUrl = reader.result;
      this.logoInBase64 = reader.result;
    };
  }

  faviconUpload(file: FileList) {
    this.faviconFile = file.item(0);
    var reader = new FileReader();
    reader.readAsDataURL(this.faviconFile);
    let faviconFileName = this.faviconFile.name;
    reader.onload = e => {
      this.faviconUrl = reader.result;
      this.faviconInBase64 = reader.result;
    };
  }

  save() {
    var applicationData = {
      applicationName: this.applicationForm.value.applicationName,
      applicationCode: this.applicationForm.value.applicationCode,
      enableFlag: this.applicationForm.value.enableFlag,
      description: this.applicationForm.value.description,
      logo: this.logoInBase64,
      favicon: this.faviconInBase64
    };
    this.applicationDataService.save(applicationData).subscribe((response: any)=>{
      this.applicationDataService.openDialog("success", response.description).subscribe((response)=>{
        this.router.navigate(['applicationManagement']);
      }),
        (err) => {
        
        this.applicationDataService.openDialog("error", err.error.description).subscribe((response: any)=>{
         //Dialog Response can be handled here
        })
      }
    });
  }

  abortSaveAction() {
    this.router.navigate(["/applicationManagement"]);
  }
}

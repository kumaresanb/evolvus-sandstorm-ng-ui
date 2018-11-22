import { FormControl } from '@angular/forms';
import { ApplicationDataService } from './../application-data.service';
import { ApplicationModel } from '../application.model';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-update-application-entity',
  templateUrl: './update-application-entity.component.html',
  styleUrls: ['./update-application-entity.component.css']
})

export class UpdateApplicationEntityComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private applicationDataService: ApplicationDataService) { 
    this.applicationForm = new FormGroup({
      applicationName: new FormControl(""),
      applicationCode: new FormControl(""),
      description: new FormControl(""),
      enableFlag: new FormControl("")
    });
  }
  platformURL = environment.platformURL;
  selectedApplicationCode: string;
  selectedApplication: any;

  viewType = true;
  logoFile: File = null;
  faviconFile: File = null;
  logoInBase64: string = "";
  faviconInBase64: string = "";
  logoUrl: any;
  faviconUrl: any;
  applications: any[];
  applicationForm: FormGroup;

  ngOnInit() {
    this.selectedApplicationCode = "" + this.route.snapshot.params['id'];
    this.applicationDataService.getOneApplication(this.selectedApplicationCode).subscribe((response: any) => {
      if(response.data.length!=0){
        this.selectedApplication = response.data[0];
        this.applicationForm.patchValue({
          applicationName: this.selectedApplication.applicationName,
          applicationCode: this.selectedApplication.applicationCode,
          enableFlag: this.selectedApplication.enableFlag,
          description: this.selectedApplication.description
        });
        this.logoUrl = this.selectedApplication.logo;
        this.faviconUrl = this.selectedApplication.favicon;
      }
      }, (err)=>{
        this.applicationDataService.openDialog("error", err.error.description).subscribe((response)=>{
          // Dialog response can be handled here
        })
      });
  }



  logoUpload(file: FileList) {
    this.logoFile = file.item(0);
    var reader = new FileReader();
    reader.readAsDataURL(this.logoFile);
    reader.onload = (e) => {
      this.selectedApplication.logo = reader.result;
      this.logoInBase64 = reader.result;
      this.logoUrl = this.logoInBase64;
    }
  }
  


  faviconUpload(file: FileList) {

    this.faviconFile = file.item(0);
    var reader = new FileReader();
    reader.readAsDataURL(this.faviconFile);
    reader.onload = (e) => {
      this.selectedApplication.favicon = reader.result;
      this.faviconInBase64 = reader.result;
      this.faviconUrl = this.faviconInBase64;

    }

  }

  update() {
    var applicationData = {
      applicationName: this.applicationForm.value.applicationName,
      applicationCode: this.applicationForm.value.applicationCode,
      enableFlag: this.applicationForm.value.enableFlag,
      description: this.applicationForm.value.description,
      logo: this.logoInBase64,
      favicon: this.faviconInBase64
    };
    this.applicationDataService.update(applicationData).subscribe((response: any)=>{
      this.applicationDataService.openDialog("success", response.description).subscribe((response)=>{
        this.router.navigate(['applicationManagement']);
      })},
        (err) => {
        this.applicationDataService.openDialog("error", err.error.description).subscribe((response: any)=>{
         //Dialog Response can be handled here
        })
      }
    );
  

  }

  

  abortUpdateAction(){
this.router.navigate(['/viewApplication', this.selectedApplication.applicationCode]);
  }
 



}

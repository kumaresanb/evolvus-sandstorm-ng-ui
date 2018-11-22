import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApplicationDataService } from './../application-data.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-list-applications-entity',
  templateUrl: './list-applications-entity.component.html',
  styleUrls: ['./list-applications-entity.component.css']
})
export class ListApplicationsEntityComponent implements OnInit {
  searchText: string = "";
  platformURL = environment.platformURL;

  constructor(private http: HttpClient, private router: Router, private applicationDataService: ApplicationDataService) { }
  

  // defaultFilterCriteria = {
  //   enableFlag: "",
  //   processingStatus: "",
  //   pageSize: 5,
  //   pageNo: 1
  // };
  noApplicationsDataMessage: string = "";
  noOfApplicationsInCurrentPage: number = 0;
  pageSize: number= 5;
  pageNo: number= 1;
  totalNoOfPages: number = 1;
  totalNoOfApplications: number = 0;
  startIndex: number = 0;

  ngOnInit() {

this.getAllApplications();

  }


  applications: any[] = [];
  
  selectedApplication: any;

  selectApplication(application) {
    this.selectedApplication = application;
  }

  
getAllApplications(){
  this.applicationDataService.getAllApplications().subscribe((response: any)=>{
    if(response.data.length!=0){
      this.applications = response.data;
    }
  }, (err)=>{
    this.applicationDataService.openDialog("error", err.error.description).subscribe((result)=>{
      // console.log("Server Down");
    });   
  });
}

  viewSelectedApplication() {
    this.router.navigate(['viewApplication', this.selectedApplication.applicationCode]);
  }


}

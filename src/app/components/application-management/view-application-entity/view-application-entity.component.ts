import { ApplicationDataService } from './../application-data.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApplicationModel } from '../application.model';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-view-application-entity',
  templateUrl: './view-application-entity.component.html',
  styleUrls: ['./view-application-entity.component.css']
})
export class ViewApplicationEntityComponent implements OnInit {



  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private applicationDataService: ApplicationDataService
  ) { }

  platformURL = environment.platformURL;
  selectedApplicationCode = "";
  selectedApplication: any;
 

  ngOnInit() {
    this.selectedApplicationCode = "" + this.route.snapshot.params['id'];
    this.applicationDataService.getOneApplication(this.selectedApplicationCode).subscribe((response: any) => {
      if(response.data.length!=0){
        this.selectedApplication = response.data[0];
      }
      }, (err)=>{
        this.applicationDataService.openDialog("error", err.error.description).subscribe((response)=>{
          // Dialog response can be handled here
        })
      });

  
  }
updateApplication(){
this.router.navigate(['/updateApplication', this.selectedApplication.applicationCode]);
}
abortViewAction(){

  this.router.navigate(['/applicationManagement']);
    }
}

import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { EntityDataService } from '../entity-data.service';
import { SandstormGlobalVariablesService } from './../../../shared/sandstorm-global-variables.service';

@Component({
  selector: 'app-view-entity',
  templateUrl: './view-entity.component.html',
  styleUrls: ['./view-entity.component.css']
})
export class ViewEntityComponent implements OnInit {



  entityCode: string = "";
  selectedEntity: any;
  isStatusPending: boolean = true;
  user: any;
  listOfSubMenuItems: any= [];
  showWorkFlow: boolean = false;
  listOfEvents: any []=[];
    constructor(private route: ActivatedRoute, private router: Router, private entityService: EntityDataService, private globalVariableService: SandstormGlobalVariablesService) { }

  ngOnInit() {
    this.entityCode = "" + this.route.snapshot.params['id'];

    this.entityService.getOneEntityData(this.entityCode).subscribe((entityData: any)=>{

      this.selectedEntity = entityData.data[0];
      this.entityService.getCurrentUserData().subscribe((user: any)=>{
        this.user = user;   
      });
      this.listOfSubMenuItems = this.entityService.getListOfSubMenuItems();

      if(this.selectedEntity.processingStatus!='PENDING_AUTHORIZATION'){
    this.isStatusPending = false;
      }else{

        this.isStatusPending = true;
      }
    }, (err)=>{

    });

  }


  updateEntity(){
    if(!this.isStatusPending){
      this.router.navigate(['/updateEntity', this.selectedEntity.entityCode]);
    }
    }
  
  abortViewAction(){
    this.router.navigate(['/entityManagement']);
      }
  doIExist(title){
    return this.listOfSubMenuItems.includes(title);
    }
    getWorkFlowData(){
      if(!this.showWorkFlow){
        this.entityService.getWorkFlowData(this.selectedEntity._id)
        .subscribe((response: any)=>{
          this.showWorkFlow = !this.showWorkFlow;
          if(response!=null){
            this.listOfEvents = response.data;

          }
        });
      }else{
        this.showWorkFlow = !this.showWorkFlow;
      }

    }
    takeAction(type) {
      this.entityService
        .openDialog("comments", "comments")
        .subscribe(result => {
          if (result.status) {
            this.entityService
              .takeAction(type, this.selectedEntity, result.comments)
              .subscribe((response: any) => {
                this.entityService.openDialog(
                  "success",
                  response.description
                ).subscribe((result)=>{
                this.router.navigate(['entityManagement']);
                });
              }, (err)=>{
                this.entityService.openDialog(
                  "error",
                  err.description
                ).subscribe((result)=>{
                });
              });
          } else {
//when user clicks cancel on comment dialog
          }
        });
    }
}

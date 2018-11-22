
import { StarterContentService } from './starter-content.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SandstormGlobalVariablesService } from '../../shared/sandstorm-global-variables.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-starter-content',
  templateUrl: './starter-content.component.html',
  styleUrls: ['./starter-content.component.css']
})
export class StarterContentComponent implements OnInit {

user: any = {};
eventData: any = [];
panelOpenState = false;
isPanelOpened = false;


  constructor(private globalVariableService: SandstormGlobalVariablesService, private starterContentService: StarterContentService, private router: Router)
 { }


  ngOnInit() {
    this.user = this.globalVariableService.currentUser.getValue();
this.getWfEventData();
setInterval(()=>{
 this.getWfEventData();
},6000)

  }

getTimeOfRequest(dateTime){
var eventDateTime = dateTime;
var currentDateTime = +new Date();
var eventDateTimeInMilliSeconds = +new Date(eventDateTime);
var currentDateTimeInMilliSeconds = +new Date();
var differenceDateTimeInMilliSeconds = currentDateTimeInMilliSeconds - eventDateTimeInMilliSeconds;
var requestDateTimeInHours = (differenceDateTimeInMilliSeconds/(60*60*1000));
if(requestDateTimeInHours<1){ // in minutes
return "Requested "+ (Math.ceil(differenceDateTimeInMilliSeconds / (60 * 1000)))+" minutes ago";
}else if(requestDateTimeInHours<24){
  return "Requested "+(Math.floor(requestDateTimeInHours))+" hour/s ago";
}else{
  return "Requested "+(Math.floor(requestDateTimeInHours / 24))+" day/s ago";  
}
}


getWfEventData(){
  this.starterContentService.getSWEEventData()
.subscribe((eventData: any)=>{
  if(eventData!=null){
    this.eventData = eventData.data;
  }
  
});
}

view(wfEntity, id){

  this.starterContentService.getWfEntityData(wfEntity, id).subscribe((response: any)=>{
    if(response.data.length!=0){
      if(wfEntity=='ENTITY'){
        this.router.navigate(["viewEntity", response.data[0].entityCode]);
      }else if(wfEntity=='ROLE'){
        this.router.navigate(["viewRole", response.data[0].roleName]);
      }else if(wfEntity=='APPLICATION'){
        this.router.navigate(['viewApplication', response.data[0].applicationCode]);
      }else if(wfEntity=='USER'){
        this.router.navigate(["viewUser", response.data[0].userId]);
      }
    }
  })

}

panelOpened(){
    this.isPanelOpened = !this.isPanelOpened;
}
}

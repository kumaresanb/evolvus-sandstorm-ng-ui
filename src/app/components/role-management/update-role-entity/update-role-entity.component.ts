import { RoleModel } from '../role-model';
import { Component, OnInit } from '@angular/core';
import { RoleDataService } from "../role-data.service";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MenuGroup } from "../role-model";
import { MenuItems } from "../role-model";
import {
  FormGroup,
  FormControl,
  NgForm,
  FormArray,
  Validators
} from "@angular/forms";

RoleModel
@Component({
  selector: 'app-update-role-entity',
  templateUrl: './update-role-entity.component.html',
  styleUrls: ['./update-role-entity.component.css']
})

export class UpdateRoleEntityComponent implements OnInit {



  roleData: any;
  roleForm: FormGroup;  
  listOfApplicationCodes: any;
  listOfMenuGroups: MenuGroup[];
  listOfSelectedMenuGroups: MenuGroup[];
  listOfMenuItemCodes: string[] = [];
  listOfSubMenuItemCodes: string[] = [];
  menuGroupNotSelected = false;
  menuItemsChanged = false;
  listOfApplications: any[]=[];
  listOfRoleTypes: any;
  listOfTxnTypes: any;
  selectedMenuGroups: any[] = [];
  selectedMenuItems: any[] = [];
  selectedSubMenuItems: any[] = [];
  subMenuItemsChanged: boolean = false;
  // listOfSubMenuItems: any= [];

  user: any;   //currently loggedIn User
 // we have used two attributes of mat-checkbox in html. (change) and [checked].. 
 //[checked] is used in order to check the boxes of already selected Menu Items while loading
 //(change) is used to update any changes to the checkbox after loading...
 // But when there are any changes to made to the checkbox, both the attributes are triggered..
 // Both attributes call two different functions with different logic which will create conflicts..
 // Hence 'menuItemsChanged' is used to in order to avoid conflicts..


  constructor(private roleDataService: RoleDataService, private route: ActivatedRoute, private router: Router) { 
    this.roleForm = new FormGroup({
      activationStatus: new FormControl(null, Validators.required),
      roleName: new FormControl(null, Validators.required),
      applicationCode: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      roleType: new FormControl('', Validators.required),
      // txnType: new FormControl([], Validators.required)
    });
  } 

  ngOnInit() {
    this.roleDataService.getCurrentUserData().subscribe((user: any)=>{
      this.user = user;   
    });
    // this.listOfSubMenuItems = this.roleDataService.getListOfSubMenuItems();
    this.roleDataService
    .getlistOfApplicationCategory()
    .subscribe((response: any) => {
      this.listOfApplications = response.data;
      this.listOfApplicationCodes = this.listOfApplications.map(application=>application.applicationCode); 
    });



    var roleName = this.route.snapshot.params['id'];
    this.roleDataService.getOneRoleData(roleName)
    .subscribe((response: any)=>{
      if(response!=null){
       this.roleData = response.data[0];
       this.listOfSelectedMenuGroups = this.roleData.menuGroup;
       this.addSelectedMenuItemCodes();
       this.addSelectedSubMenuItemCodes();
       
setTimeout(()=>{
  this.roleDataService
       .getListOfMenuGroups(response.data[0].applicationCode)
       .subscribe((response: any) => {
         this.listOfMenuGroups = response.data;
    
       });   
}, 100);
         this.roleForm.patchValue({
         activationStatus: this.roleData.activationStatus,
         roleName: this.roleData.roleName,
         applicationCode: this.roleData.applicationCode,
         description: this.roleData.description,
         txnType: this.roleData.txnType,
         roleType: this.roleData.roleType
 
       });
      }
  }

 );
    // this.getRoleData(roleName);
    this.getRoleTypes();
    this.getTxtTypes();

    
  }


 
addSelectedMenuItemCodes(){   
//All the MenuItemCodes of selected MenuItems of the selected Role is added to a list for UI representation during loading..
  for(let menuGroup of this.listOfSelectedMenuGroups){
    for(let menuItem of menuGroup.menuItems){
      this.listOfMenuItemCodes.push(menuItem.menuItemCode);
    }
  }
 



}
addSelectedSubMenuItemCodes(){   
  //All the MenuItemCodes of selected MenuItems of the selected Role is added to a list for UI representation during loading..

    for(let menuGroup of this.listOfSelectedMenuGroups){
      for(let menuItem of menuGroup.menuItems){
        if(menuItem.subMenuItems){
          for(let subMenuItem of menuItem.subMenuItems){
            this.listOfSubMenuItemCodes.push(subMenuItem.menuItemCode);
          }
        }
      }
    }
  }
  

// getRoleData(roleName){
//   this.roleDataService.getOneRoleData(roleName)
//      .subscribe((response: any)=>{
//        if(response!=null){
//         this.roleData = response.data[0];
//         this.listOfSelectedMenuGroups = this.roleData.menuGroup;
//         this.addSelectedMenuItemCodes();
//         this.addSelectedSubMenuItemCodes();
//         this.getMenuGroups(response.data[0].applicationCode);
//         this.roleForm.patchValue({
//           activationStatus: this.roleData.activationStatus,
//           roleName: this.roleData.roleName,
//           applicationCode: this.roleData.applicationCode,
//           description: this.roleData.description,
//           txnType: this.roleData.txnType,
//           roleType: this.roleData.roleType
  
//         });
//        }
//    }

//   );
// }


getMenuGroups(applicationCode) {
  this.roleDataService
    .getListOfMenuGroups(applicationCode)
    .subscribe((response: any) => {
      this.listOfMenuGroups = response.data;
      this.addSelectedMenuItemCodes();
    });
}

addMenuItem(menuGroup, menuItem) {
this.menuItemsChanged = true;
if(menuItem.selectedFlag){
  menuItem.selectedFlag = false;
}else{
  menuItem.selectedFlag = true;
}

}
addSubMenuItem(menuItemFromUser, subMenuItemFromUser) {
  this.subMenuItemsChanged = true;
  if(subMenuItemFromUser.selectedFlag){
    subMenuItemFromUser.selectedFlag = false;
  }else{
    subMenuItemFromUser.selectedFlag = true;
  }
}

update(){

  this.selectedMenuGroups = this.listOfMenuGroups;
  for (var mgIndex = 0; mgIndex < this.selectedMenuGroups.length; mgIndex++) {
    this.selectedMenuGroups[mgIndex].menuItems = this.selectedMenuGroups[
      mgIndex
    ].menuItems.filter(menuItem => menuItem.selectedFlag == true);

if(this.selectedMenuGroups[mgIndex].menuItems.length!=0){
for (
  var miIndex = 0;
  miIndex < this.selectedMenuGroups[mgIndex].menuItems.length;
  miIndex++
) {
  if(this.selectedMenuGroups[mgIndex].menuItems[miIndex].subMenuItems){
  this.selectedMenuGroups[mgIndex].menuItems[miIndex].subMenuItems = this.selectedMenuGroups[mgIndex].menuItems[miIndex].subMenuItems.filter(subMenuItem => subMenuItem.selectedFlag == true);
  }
}
}else{
this.selectedMenuGroups.splice(mgIndex, 1);
}

  }

    
      this.roleData.roleName = this.roleForm.value.roleName,
      this.roleData.applicationCode = this.roleForm.value.applicationCode,
      this.roleData.activationStatus = this.roleForm.value.activationStatus,
      this.roleData.description = this.roleForm.value.description,
      this.roleData.menuGroup = this.selectedMenuGroups
      this.roleData.roleType = this.roleForm.value.roleType,
      this.roleData.txnType = this.roleForm.value.txnType

      this.roleDataService.update(this.roleData).subscribe(
        (response: any) => {
         this.roleDataService.openDialog(
            "success",
           response.description
          ).subscribe((result)=>{
            this.router.navigate(['roleManagement']);
          });
      },
      err => {
        this.roleDataService.openDialog("error", err.error.description).subscribe((response)=>{
          this.router.navigate(['viewRole', this.roleData.roleName]);  
        })
      }
    );
  
}


checkIfMenuItemIsSelected(menuItem): boolean{
if(!this.menuItemsChanged){

  if(this.listOfMenuItemCodes.includes(menuItem.menuItemCode)){
 menuItem.selectedFlag = true;
 return true;
  }
}else{
  return menuItem.selectedFlag;
}
}


checkIfSubMenuItemIsSelected(subMenuItem): boolean{
  if(!this.subMenuItemsChanged){
    if(this.listOfSubMenuItemCodes.includes(subMenuItem.menuItemCode)){

      subMenuItem.selectedFlag = true;
   return true;
    }
  }else{
    return subMenuItem.selectedFlag;
  }
}

abortSaveAction(){
  // var tempStatus = "";
  // if(this.roleForm.touched){
  //   tempStatus = this.roleDataService.openDialog("alert", "All the changes will be discarded, click OK to continue!");
  //   if(tempStatus === "success"){
      this.router.navigate(['viewRole', this.roleData.roleName]);  
  //   }
  // }else{
  //   this.router.navigate(['viewRole', this.roleData.roleName]);  
  // }

}
getRoleTypes(){
  this.roleDataService.getLookUpCodeValues('ROLE_ROLETYPE').subscribe((response: any)=>{
  this.listOfRoleTypes = response.data.map(lookUp => lookUp.value);
  });
  }
  getTxtTypes(){
    this.roleDataService.getLookUpCodeValues('ROLE_TXNTYPE').subscribe((response: any)=>{
      this.listOfTxnTypes = response.data.map(lookUp => lookUp.value);
      });
  }

// doIExist(title){
//   return this.listOfSubMenuItems.includes(title);
//   }

  
}

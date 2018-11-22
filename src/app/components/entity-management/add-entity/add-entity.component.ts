import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EntityModel } from './../entity.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EntityDataService } from '../entity-data.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-entity',
  templateUrl: './add-entity.component.html',
  styleUrls: ['./add-entity.component.css']
})


export class AddEntityComponent implements OnInit {

  entityData: EntityModel;
  entityForm: FormGroup;
  parentEntities: any;
  listOfParentEntities: EntityModel[]=[];
  listOfParentEntityNames: string[]=[];
  filteredEntityNames: Observable<string[]>;
  user: any;
  // listOfSubMenuItems: any= [];

  constructor(public formBuilder: FormBuilder, private entityService: EntityDataService, private router: Router) {
    this.entityForm = new FormGroup({
      name: new FormControl('',[Validators.pattern("[a-zA-Z0-9_-]*"), Validators.pattern(/^\S*$/),
      Validators.minLength(6), Validators.maxLength(35)]),
      entityCode: new FormControl('', [Validators.pattern("[a-zA-Z0-9_-]*"), Validators.pattern(/^\S*$/),
      Validators.minLength(6), Validators.maxLength(35)]),
      parent: new FormControl('', Validators.required),
      description: new FormControl('', [
      Validators.minLength(6), Validators.maxLength(140)]),
    });
  }

  ngOnInit() {
    this.getParentEntities();
    this.getFilteredEntityNames();
    this.entityService.getCurrentUserData().subscribe((user: any)=>{
      this.user = user;   
    });
    // this.listOfSubMenuItems = this.entityService.getListOfSubMenuItems();

    
  }


getParentEntities(){
  this.entityService.getParentEntities().subscribe((response: any)=>{
    this.listOfParentEntities = response.data;
    this.listOfParentEntityNames = this.listOfParentEntities.map(entity => entity.name);
  });
}


getFilteredEntityNames(){
  this.filteredEntityNames = this.entityForm.controls.parent.valueChanges
  .pipe(
    startWith(''),
    map(entityName => entityName ? this.filterEntities(entityName) : this.listOfParentEntityNames.slice())
  );
}


  save() {
    if(this.isAValidSelection('entity', this.entityForm.value.parent)){ -
      this.entityService.save(this.entityForm.value).subscribe((data: {savedEntityObject: Object, description: string}) => {
        this.entityService.openDialog(
           "success",
          data.description
         ).subscribe((result)=>{
         this.router.navigate(['entityManagement']);
         });
    
       }, (err)=>{
        this.entityService.openDialog(
          "error",
         err.error.description+"."
        ).subscribe((result)=>{
  
        });
      });
    }else{
      this.entityService
      .openDialog("error", "Please Select a Valid Entity" + ".")
      .subscribe(result => {
        // Dialog Response can be handled here
      });
    }
    
  }

  
  private filterEntities(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listOfParentEntityNames.filter(entityName => entityName.toLowerCase().indexOf(filterValue) === 0);
  }

  
  abortSaveAction() {
    this.router.navigate(["/entityManagement"]);
  }


  isAValidSelection(propertyName, value) {
    if (propertyName == "entity") {
      if (this.listOfParentEntityNames.includes(value)) {
        return true;
      } else {
        return false;
      }
    }
  }

  // doIExist(title){
  //   return this.listOfSubMenuItems.includes(title);
  //   }

  toUpperCase(event){
    event.target.value = event.target.value.toUpperCase();
 }
}


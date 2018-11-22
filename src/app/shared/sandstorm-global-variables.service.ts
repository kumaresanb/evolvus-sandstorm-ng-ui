import { BehaviorSubject } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SandstormGlobalVariablesService implements OnInit{

  constructor() { }

  user: any = {};
  currentUser = new BehaviorSubject<any>(this.user);
  
ngOnInit(){

}



}

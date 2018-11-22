
import { SessionexpiredComponent } from './../components/sessionexpired/sessionexpired.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router/src/config';
import { AuthGuardService } from './../shared/auth-guard.service';
import { StarterContentComponent } from '../components/starter-content/starter-content.component';
import { ListRolesEntityComponent } from '../components/role-management/list-roles-entity/list-roles-entity.component';
import { AddRoleEntityComponent } from '../components/role-management/add-role-entity/add-role-entity.component';
import { ViewRoleEntityComponent } from '../components/role-management/view-role-entity/view-role-entity.component';
import { AddUserComponent } from '../components/user-management/add-user/add-user.component';
import { ListUsersComponent } from './../components/user-management/list-users/list-users.component';
import { ViewUserComponent } from '../components/user-management/view-user/view-user.component';
import { UpdateUserComponent } from '../components/user-management/update-user/update-user.component';
import { SaveApplicationEntityComponent } from '../components/application-management/save-application-entity/save-application-entity.component';
import { ListApplicationsEntityComponent } from '../components/application-management/list-applications-entity/list-applications-entity.component';
import { UpdateApplicationEntityComponent } from '../components/application-management/update-application-entity/update-application-entity.component';
import { ViewApplicationEntityComponent } from '../components/application-management/view-application-entity/view-application-entity.component';
import { UpdateRoleEntityComponent } from '../components/role-management/update-role-entity/update-role-entity.component';
import { ListEntityComponent } from '../components/entity-management/list-entity/list-entity.component';
import { AddEntityComponent } from '../components/entity-management/add-entity/add-entity.component';
import { ViewEntityComponent } from './../components/entity-management/view-entity/view-entity.component';
import { UpdateEntityComponent } from '../components/entity-management/update-entity/update-entity.component';
import { LoginConsoleComponent } from './../login-console/login-console.component';
import { BulkUploadComponent } from './../components/maintenance/bulk-upload/bulk-upload.component';
import { NotFoundComponent } from './../components/not-found/not-found.component';
const routes: Routes =[
  {
    path: "", 
    component: LoginConsoleComponent, pathMatch: 'full'
},{
    path: "login",
    component: LoginConsoleComponent
}, {
  path: "sessionExpired",
  component: SessionexpiredComponent
},
  { path: 'home', component: StarterContentComponent, canActivate: [AuthGuardService]  },

  { path: 'applicationManagement', component: ListApplicationsEntityComponent , canActivate: [AuthGuardService] },
  { path: 'createApplication', component: SaveApplicationEntityComponent , canActivate: [AuthGuardService] },
  { path: 'viewApplication/:id', component: ViewApplicationEntityComponent, canActivate: [AuthGuardService]  },
  { path: 'updateApplication/:id', component: UpdateApplicationEntityComponent, canActivate: [AuthGuardService]},

  { path: 'roleManagement', component: ListRolesEntityComponent , canActivate: [AuthGuardService] },
  { path: 'addRole', component: AddRoleEntityComponent , canActivate: [AuthGuardService] },
  { path: 'viewRole/:id', component: ViewRoleEntityComponent , canActivate: [AuthGuardService] },
  { path: 'updateRole/:id', component: UpdateRoleEntityComponent, canActivate: [AuthGuardService] },

  { path: 'userManagement', component: ListUsersComponent , canActivate: [AuthGuardService] },
   { path: 'addUser', component: AddUserComponent, canActivate: [AuthGuardService] },
   { path: 'viewUser/:id', component: ViewUserComponent , canActivate: [AuthGuardService] },
   { path: 'updateUser/:id', component: UpdateUserComponent , canActivate: [AuthGuardService] },

   { path: 'entityManagement', component: ListEntityComponent , canActivate: [AuthGuardService] },
   { path: 'addEntity', component: AddEntityComponent , canActivate: [AuthGuardService] },
   { path: 'viewEntity/:id', component: ViewEntityComponent , canActivate: [AuthGuardService] },
   { path: 'updateEntity/:id', component: UpdateEntityComponent , canActivate: [AuthGuardService] },
  
   { path: 'bulkUpload', component: BulkUploadComponent , canActivate: [AuthGuardService] },

   {path: '**', component: NotFoundComponent} 
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [ RouterModule]
})
export class AppRoutingModule {
  
 }

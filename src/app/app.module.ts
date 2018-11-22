
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../app/module/material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


//MaterialLibrary

import { MatNativeDateModule, MatDialogRef } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTreeModule} from '@angular/material/tree';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import 'hammerjs';
//SERVICE COMPONENTS

import { ApplicationDataService } from './components/application-management/application-data.service';
import { ResponsiveService } from './components/shared/responsive.service';
import { RoleDataService } from './components/role-management/role-data.service';
import { EntityDataService } from './components/entity-management/entity-data.service';
import { AuthenticationService } from './login-console/authentication/login/login.service';
import { JWTTokenIntercepter } from './shared/http.intercepter';
import { AuthGuardService } from './shared/auth-guard.service';


//LOGIN PAGE COMPONENT

import { LoginConsoleComponent } from './login-console/login-console.component';

//HOME PAGE COMPONENTS

import { StarterHeaderComponent } from './common-component/starter-header/starter-header.component';
import { StarterLeftSideComponent } from './common-component/starter-left-side/starter-left-side.component';
import { StarterFooterComponent } from './common-component/starter-footer/starter-footer.component';

//APPLICATION COMPONENT

import { SaveApplicationEntityComponent } from './components/application-management/save-application-entity/save-application-entity.component';
import { ListApplicationsEntityComponent } from './components/application-management/list-applications-entity/list-applications-entity.component';
import { UpdateApplicationEntityComponent } from './components/application-management/update-application-entity/update-application-entity.component';
import { ViewApplicationEntityComponent } from './components/application-management/view-application-entity/view-application-entity.component';

//ROLE COMPONENT

import { ListRolesEntityComponent } from './components/role-management/list-roles-entity/list-roles-entity.component';
import { StarterContentComponent } from './components/starter-content/starter-content.component';
import { AddRoleEntityComponent } from './components/role-management/add-role-entity/add-role-entity.component';
import { ViewRoleEntityComponent } from './components/role-management/view-role-entity/view-role-entity.component';
import { UpdateRoleEntityComponent } from './components/role-management/update-role-entity/update-role-entity.component';

//ENTITY COMPONENT

import { ListEntityComponent } from './components/entity-management/list-entity/list-entity.component';
import { AddEntityComponent } from './components/entity-management/add-entity/add-entity.component';
import { ViewEntityComponent } from './components/entity-management/view-entity/view-entity.component';
import { UpdateEntityComponent } from './components/entity-management/update-entity/update-entity.component';

//USER COMPONENT

import { AddUserComponent } from './components/user-management/add-user/add-user.component';
import { ListUsersComponent } from './components/user-management/list-users/list-users.component';
import { ViewUserComponent } from './components/user-management/view-user/view-user.component';
import { UpdateUserComponent } from './components/user-management/update-user/update-user.component';

// BULK UPLOAD COMPONENT

import { BulkUploadComponent } from './components/maintenance/bulk-upload/bulk-upload.component';

// EVOLVUS NPM COMPONENTS

import {EvolvusWorkflowViewModule} from '@evolvus/evolvus-workflow-event-view';
import { EvolvusBulkUploadModule } from '@evolvus/evolvus-bulk-upload-view';

//HELPER COMPONENTS

import { SessionexpiredComponent } from './components/sessionexpired/sessionexpired.component'; 
import { ConfirmationDialogEntityComponent } from './shared/confirmation-dialog-entity/confirmation-dialog-entity.component';
import { SearchPipe } from './components/shared/search.pipe';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    StarterHeaderComponent,
    StarterLeftSideComponent,
    StarterFooterComponent,
    StarterContentComponent,
    ListRolesEntityComponent,
    AddRoleEntityComponent,
    ViewRoleEntityComponent,
    UpdateRoleEntityComponent,
    ListApplicationsEntityComponent,
    SaveApplicationEntityComponent,
    UpdateApplicationEntityComponent,
    SearchPipe,
    ViewApplicationEntityComponent,
    ConfirmationDialogEntityComponent,
    ListEntityComponent,
    AddEntityComponent,
    ViewEntityComponent,
    UpdateEntityComponent,
    AddUserComponent,
    ListUsersComponent,
    ViewUserComponent,
    UpdateUserComponent,
    SessionexpiredComponent,
    LoginConsoleComponent,
    BulkUploadComponent,
    NotFoundComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    MatExpansionModule,
    EvolvusWorkflowViewModule,
EvolvusBulkUploadModule,
MatTreeModule,
MatMenuModule,
MatProgressBarModule
    
  ],
  entryComponents: [
    ConfirmationDialogEntityComponent, LoginConsoleComponent
  ],
  providers: [ResponsiveService, RoleDataService, EntityDataService, ApplicationDataService,   AuthGuardService
,    AuthenticationService, 
    {
    provide: HTTP_INTERCEPTORS,
    useClass: JWTTokenIntercepter,
    multi: true
}],
  bootstrap: [AppComponent]
})
export class AppModule { }

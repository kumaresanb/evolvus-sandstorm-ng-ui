import { ActivatedRoute, Router } from "@angular/router";
import { UserDataService } from "./../user-data.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-view-user",
  templateUrl: "./view-user.component.html",
  styleUrls: ["./view-user.component.css"]
})
export class ViewUserComponent implements OnInit {
  userId: string = "";
  selectedUser: any;
  isStatusPending: boolean = true;
  loggedInUser: any;
  listOfSubMenuItems: any = [];
  showWorkFlow: boolean = false;
  listOfEvents: any[] = [];

  constructor(
    private userDataService: UserDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = "" + this.route.snapshot.params["id"];
    this.userDataService.getOneUserData(this.userId).subscribe(
      (userData: any) => {
        if (userData.data.length != 0) {
          this.selectedUser = userData.data[0];
          if (this.selectedUser.processingStatus != "PENDING_AUTHORIZATION") {
            this.isStatusPending = false;
          } else {
            this.isStatusPending = true;
          }
        } else {
          //If there is no data with that Username
          this.userDataService
            .openDialog("error", "No User found with UserId " + this.userId!)
            .subscribe(response => {
              this.router.navigate(["userManagement"]);
            });
        }
      },
      err => {
        alert("No User Data");
      }
    );
    this.userDataService.getCurrentUserData().subscribe((user: any) => {
      this.loggedInUser = user;
    });
     this.listOfSubMenuItems = this.userDataService.getListOfSubMenuItems();
  }

  updateUser() {
    if (!this.isStatusPending) {
      this.router.navigate(["/updateUser", this.selectedUser.userId]);
    }
  }

  abortViewAction() {
    this.router.navigate(["/userManagement"]);
  }

  doIExist(title) {
    return this.listOfSubMenuItems.includes(title);
  }

  getWorkFlowData() {
    if (!this.showWorkFlow) {
      this.userDataService
        .getWorkFlowData(this.selectedUser._id)
        .subscribe((response: any) => {
          this.showWorkFlow = !this.showWorkFlow;
          if (response != null) {
            this.listOfEvents = response.data;
          }
        });
    } else {
      this.showWorkFlow = !this.showWorkFlow;
    }
  }
  takeAction(type) {
    console.log('type', type);

    this.userDataService
      .openDialog("comments", "comments")
      .subscribe(result => {
        if (result.status) {
          this.userDataService
            .takeAction(type, this.selectedUser, result.comments)
            .subscribe(
              (response: any) => {
                this.userDataService
                  .openDialog("success", response.description)
                  .subscribe(result => {
                    this.router.navigate(["userManagement"]);
                  });
              },
              err => {
                this.userDataService
                  .openDialog("error", err.description)
                  .subscribe(result => {});
              }
            );
        } else {
        }
      });
  }
}

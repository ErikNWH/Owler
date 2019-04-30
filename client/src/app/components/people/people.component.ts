import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../services/users.service";
import * as _ from "lodash";
import { TokenService } from "src/app/services/token.service";
import io from "socket.io-client";
import { Router } from '@angular/router';

@Component({
  selector: "app-people",
  templateUrl: "./people.component.html",
  styleUrls: ["./people.component.css"]
})
export class PeopleComponent implements OnInit {
  socket: any;
  users = [];
  userArr = [];
  loggedInUser: any;

  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.socket = io("http://localhost:3000");
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.GetPayload();
    this.GetUsers();
    this.GetUser();

    this.socket.on("refreshPage", () => {
      this.GetUsers();
      this.GetUser();
    });
  }

  GetUsers() {
    this.userService.GetAllUsers().subscribe(data => {
      //console.log(data)
      _.remove(data.result, { username: this.loggedInUser.username });
      this.users = data.result;
    });
  }

  GetUser() {
    this.userService.GetUserById(this.loggedInUser._id).subscribe(data => {
      // console.log(data)
      this.userArr = data.result.following;
    });
  }

  FollowUser(user) {
    this.userService.FollowUser(user._id).subscribe(data => {
      this.socket.emit("refresh", {});
      //console.log(data)
    });
  }

  ViewUser(user) {
    this.router.navigate([user.username]);
    if (this.loggedInUser.username !== user.username)
    console.log(user.username)
      this.userService.ProfileNotifcations(user._id).subscribe(
        data => {
          this.socket.emit("refresh", {});
        },
        err => console.log(err)
      );
  }

  CheckInArray(arr, id) {
    const result = _.find(arr, ["userFollowed._id", id]);
    if (result) {
      return true;
    } else {
      return false;
    }
  }
}

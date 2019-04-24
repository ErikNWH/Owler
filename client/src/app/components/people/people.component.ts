import { Component, OnInit } from '@angular/core';
import { UsersService } from "./../../services/users.service";

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  users = [];

  constructor(private userService: UsersService) { }

  ngOnInit() {
    this.GetUsers();
  }

  GetUsers() {
    this.userService.GetAllUsers().subscribe(data => {
      //console.log(data)
      this.users = data.result
    })
  }

}

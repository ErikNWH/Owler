import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import * as io from "socket.io-client";

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit {

  socket: any;
  user: any;
  userData: any;

  constructor(private tokenService: TokenService, private usersService: UsersService) {
    this.socket = io('http://localhost:3000')
  }

  ngOnInit() {
    this.user = this.tokenService.GetPayload()

    this.GetUser()
    this.socket.on('refreshPage', () => {
      this.GetUser
    })
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(data => {
      this.userData = data.result;
    })

  }

}

import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {

  socket: any;
  following = [];
  user: any;

  constructor(private tokenService: TokenService, private usersService: UsersService) {
    this.socket = io('http://localhost:3000')
  }

  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    this.GetUser();

    this.socket.on('refreshPage', () => {
      this.GetUser();
    })
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(data => {
      //console.log(data);
      this.following = data.result.following;
    }, err => console.log(err));
  }

  UnFollowUser(user) {
    //console.log(user);
    this.usersService.UnFollowUser(user._id).subscribe(data => {
      console.log(data)
      this.socket.emit('refresh', {});
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import * as _ from "lodash";
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  socket: any;
  posts = [];
  user: any;
  editForm: FormGroup;
  postValue: any;
  modalElement: any;

  constructor(private postService: PostService, private tokenService: TokenService, private router: Router, private fb: FormBuilder) {
    this.socket = io('http://localhost:3000')
  }

  ngOnInit() {
    this.modalElement = document.querySelector('.modal');
    M.Modal.init(this.modalElement, {});

    this.user = this.tokenService.GetPayload();

    this.AllPosts();
    this.socket.on('refreshPage', (data) => {
      this.AllPosts();
    });

    this.InitEditForm();
  }

  InitEditForm() {
    this.editForm = this.fb.group({
      editedPost: ['', Validators.required]
    });
  }

  AllPosts() {
    this.postService.getAllPosts().subscribe(data => {
      this.posts = data.posts;
    // console.log(data);
    }, err => {
      if(err.error.token === null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    });
  }

  OpenEditModal(post) {
    //console.log(post)
    this.postValue = post;
    console.log(this.postValue)
  }

  SubmitEditPost() {
    console.log(this.editForm.value);
    const body = {
      id: this.postValue._id,
      post: this.editForm.value.editedPost
    }
    this.postService.EditPost(body).subscribe(data => {
      console.log(data)
      this.socket.emit('refresh', {})
    }, err => console.log(err))
    M.Modal.getInstance(this.modalElement).close();
    this.editForm.reset();
  }

  CloseModal() {
    M.Modal.getInstance(this.modalElement).close();
    this.editForm.reset();
  }

  DeletePost() {
    this.postService.DeletePost(this.postValue._id).subscribe(
      data => {
         console.log(data)
        this.socket.emit('refresh', {});
      },
      err => console.error(err)
    );
  }

  LikePost(post) {
    this.postService.addLike(post).subscribe(
      data => {
        //console.log(data)
        this.socket.emit('refresh', {});
      },
      err => console.error(err)
    );
  }

  CheckInLikesArray(arr, username){
    return _.some(arr, {username: username})
  }
  
  TimeFromNow(time){
    return moment(time).fromNow();
  }

  OpenCommentBox(post) {
    this.router.navigate(['post', post._id]);
  }
}


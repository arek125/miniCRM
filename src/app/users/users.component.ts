import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  //users: any =[];
  //selectedUser: Object={};
  error: String = "";
  searchForm: FormGroup;
  //mode: String = "none";
  users;
  constructor(private userService: UserService, public auth: AuthService, private router: Router) { 
    this.searchForm = new FormGroup({
      'query': new FormControl()
    })

    this.searchForm.get('query').valueChanges
    .distinctUntilChanged()
    .debounceTime(400)
    .subscribe(query => {
        this.userService.getAllUsers(query);
    })

  }
    
  ngOnInit() {
    this.users = this.userService.getUsersStream();
    if(this.router.url === '/users')
      this.router.navigate(['users', this.auth.userData._id])
    // this.userService.getAllUsers().subscribe(users=>{
    //   this.users = users;
    // },error=>{
    //   this.error = error._body;
    //   setTimeout(()=>this.error = "",2000);
    // });
  }
  // selectedChange(user){
  //   this.selectedUser = user;
  //   this.mode = "edit";
  // }
  // newUser(){
  //   this.selectedUser = {};
  //   this.mode = "new";
  // }
  // newUserAdded(cU){
  //   this.users.push(cU);
  //   this.selectedUser = cU;
  //   this.mode = "edit";
  // }

}

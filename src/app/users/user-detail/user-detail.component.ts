import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: any = {};
  mode: String = "none";
  passwordrepeat= "";
  succes="";
  error="";

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router, private auth: AuthService) {
    this.activatedRoute.params.subscribe(params => {
      let id = params["id"];
      if(id=='new'){
        this.mode ='new';
        this.user = {};
        this.error = "";
      }
      else {
        this.userService.getUserInfo(id).subscribe(user=>{
          this.user = user;
          this.mode ='edit';
          this.error = "";
        },error=>{
          this.error = error;
          this.mode ='none';
        });
      }
    });
   }

  // ngOnChanges(changes: any) {
  //   if(this.mode == "edit")
  //     this.userService.getUserInfo(changes.user.currentValue._id).subscribe(user=>{
  //       this.user = user;
  //     });
  //   else if (this.mode == "new")
  //     this.user = {password: ""}
  // }

  ngOnInit() {
  }

  onSubmitUser(form){
    if(this.mode == "new"){
      this.userService.createUser(this.user).subscribe(cU=>{
        this.succes = "Użytkownik został utworzony";
        form.reset();
        this.userService.users.push(cU);
        this.router.navigate(['users',cU._id]);
        setTimeout(()=>{this.succes = "";},2000);
      },err=>{
        this.error = err._body;
        setTimeout(()=>{this.error = "";},5000);
      });
    }
    else if(this.mode == "edit"){
      this.userService.updateUser(this.user).subscribe(uU=>{
        this.succes = "Użytkownik został zaktualizowany";
        let foundIndex = this.userService.users.findIndex(x => x._id == uU._id);
        this.userService.users[foundIndex] = uU;
        setTimeout(()=>{this.succes = "";},2000);
        
      },err=>{
        this.error = err._body;
        setTimeout(()=>{this.error = "";},5000);
      });
    }

  }
  deleteUser(){
    this.userService.deleteUser(this.user._id)
      .subscribe(user => {
        if(user._id == this.user._id){
          let foundIndex = this.userService.users.findIndex(x => x._id == user._id);
          this.userService.users.splice(foundIndex, 1);
          this.router.navigate(['users']);
        }
    },err => {
      this.error = err._body;
      setTimeout(()=>{this.error = "";},5000);
    });
  }

}

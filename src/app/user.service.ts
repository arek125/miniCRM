import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class UserService {

  constructor(private authHttp: AuthHttp) {
    this.getAllUsers();
   }
  users = [];
  usersStream = new Subject();
  error="";

  getAllUsers(search?){
    if(search)
      this.authHttp.get('/api/users/'+search)
      .map(res => res.json())
      .timeout(20000)
      .do(users =>{ this.users = users })
      .subscribe( users => {
        this.usersStream.next(this.users)
      }),error=>{
        this.error = error;
        setTimeout(()=>this.error = '',5000);
    };
    else
      this.authHttp.get('/api/users')
      .map(res => res.json())
      .timeout(20000)
      .do(users =>{ this.users = users })
      .subscribe( users => {
        this.usersStream.next(this.users)
      }),error=>{
        this.error = error;
        setTimeout(()=>this.error = '',5000);
      };
  }


  getUsersStream(){
    return Observable
      .from(this.usersStream)
      .startWith(this.users)
  }

  getUserInfo(userId){
    return this.authHttp.get('/api/user/'+userId)
      .timeout(20000)
      .map(res => res.json());
  }
    
  createUser(user) {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
      return this.authHttp.post('/api/users', user, options)
        .timeout(20000)
	      .map(res => res.json());
  }
      
  updateUser(user) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
      return this.authHttp.put('/api/users/'+user._id, user, options)
        .timeout(20000)
        .map(res => res.json());
  }

  deleteUser(id) {
    return this.authHttp.delete('/api/users/'+id)
      .timeout(20000)
      .map(res => res.json());
  }

}

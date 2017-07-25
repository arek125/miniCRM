import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
	message: String="";
	userData=<any>{};


  constructor(private http: Http, private authHttp: AuthHttp) {
		// if(this.loggedIn()){
		// 	this.getUserInfo(localStorage.getItem('id_user')||sessionStorage.getItem('id_user')).subscribe(user => {
		// 		this.userData = user;
		// 	});
		// }
	}


	login(credentials) {
	let headers = new Headers({ 'Content-Type': 'application/json' });
	let options = new RequestOptions({ headers: headers });
		return this.http.post('/api/auth', credentials, options)
			.timeout(20000)
			.map(res => res.json());
	}

	loggedIn() {
	  return tokenNotExpired('id_token', sessionStorage.getItem('id_token')||localStorage.getItem('id_token'));
	}

	getUserInfo(userId){
			return this.authHttp.get('/api/user/'+userId)
				.timeout(20000)
	      .map(res => res.json());
	}


  logout() {
    localStorage.removeItem('id_token');
    sessionStorage.removeItem('id_token'); 
    localStorage.removeItem('id_user');
    sessionStorage.removeItem('id_user'); 
  }

}

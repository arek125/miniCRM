import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

interface Credentials {
  login: string,
  password: string,
  remember: boolean
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	credentials: Credentials;

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
  	this.credentials = {
  		login: '',
  		password: '',
  		remember: false
  	}
  	// if (sessionStorage.getItem('user_data') !== null)
  	// 	this.userData = JSON.parse(sessionStorage.getItem('user_data'));
  	// else if (localStorage.getItem('user_data') !== null)
  	// 	this.userData = JSON.parse(localStorage.getItem('user_data'));
  	// if(this.auth.loggedIn()){
  	// 	this.auth.getUserInfo(localStorage.getItem('id_user')||sessionStorage.getItem('id_user')).subscribe(user => {
  	//   	this.userData = user;
   //  	});
  	// }
  }

  onLogin(credentials) {
    this.auth.login(credentials).subscribe(
				data => {
					if (data.success){
						if (credentials.remember){
							localStorage.setItem('id_token', data.token);
							localStorage.setItem('id_user', data.user._id);
							//localStorage.setItem('user_data', JSON.stringify(data.user));
						}
						else{
							sessionStorage.setItem('id_token', data.token);
							sessionStorage.setItem('id_user', data.user._id);
							//sessionStorage.setItem('user_data', JSON.stringify(data.user));
						}
						this.auth.userData = data.user;
						this.router.navigateByUrl('/');
					}
					else{
						this.auth.message = data.message;
						setTimeout(()=>{this.auth.message = "";},2000);
					}
				},
				error => {
					this.auth.message = error;
					setTimeout(()=>{this.auth.message = "";},2000);
				}
			);
  }

  onLogout(){
  	this.auth.logout();
  }



}

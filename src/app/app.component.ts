import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import {BreadcrumbService} from 'ng2-breadcrumb/ng2-breadcrumb';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public auth: AuthService, private router: Router, private breadcrumbService: BreadcrumbService) { }
  ngOnInit(){
  	if(this.auth.loggedIn()){
  		this.auth.getUserInfo(localStorage.getItem('id_user')||sessionStorage.getItem('id_user')).subscribe(user => {
  	  	this.auth.userData = user;
    	});
  	}
		this.breadcrumbService.addFriendlyNameForRoute('/clients', 'Wszyscy klienci');
		this.breadcrumbService.addFriendlyNameForRoute('/myclients', 'Moi klienci');
  	this.breadcrumbService.addFriendlyNameForRoute('/users', 'Użytkownicy systemu');
  	this.breadcrumbService.addFriendlyNameForRoute('/sectors', 'Branże');
  	this.breadcrumbService.addFriendlyNameForRoute('/login', 'Logowanie');
  }
}

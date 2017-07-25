import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { provideAuth, AuthHttp, AuthConfig } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing.module';
import { ClientsComponent } from './clients/clients.component';
import { SectorsComponent } from './sectors/sectors.component';
import { UsersComponent } from './users/users.component';
import { CustomFormsModule } from 'ng2-validation';

import { UserService } from "./user.service";
import { ClientService } from './client.service';
import { TimelineService } from './timeline.service';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { SectorsService } from './sectors.service';
import { UniquePipe } from './uniqe.pipe';
import { ClientDetailComponent } from './clients/client-detail/client-detail.component';
import { LOCALE_ID } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import {Ng2BreadcrumbModule, BreadcrumbService} from 'ng2-breadcrumb/ng2-breadcrumb';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { NgProgressModule, NgProgressBrowserXhr } from 'ngx-progressbar';
import { BrowserXhr } from '@angular/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TimelineComponent } from './clients/client-detail/timeline/timeline.component';
import { MyclientsComponent } from './myclients/myclients.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp( new AuthConfig({            
  			headerName: 'x-access-token',
            headerPrefix: 'JWT',
            tokenName: 'id_token',
            tokenGetter: (() => {if (sessionStorage.getItem('id_token') === null) return localStorage.getItem('id_token'); else return sessionStorage.getItem('id_token');}),
            globalHeaders: [{ 'Content-Type': 'application/json' }],
            noJwtError: true}), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    ClientsComponent,
    SectorsComponent,
    UsersComponent,
    UniquePipe,
    ClientDetailComponent,
    LoginComponent,
    UserDetailComponent,
    TimelineComponent,
    MyclientsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2BreadcrumbModule,
    CustomFormsModule,
    NgProgressModule,
    Ng2SmartTableModule
  ],
  providers: [AuthService, AuthGuardService, ClientService, AuthHttp, UniquePipe, TimelineService, UserService, SectorsService, { provide: LOCALE_ID, useValue: "pl-PL" },
  	{
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }, BreadcrumbService, { provide: BrowserXhr, useClass: NgProgressBrowserXhr }],
  bootstrap: [AppComponent]
})
export class AppModule { }

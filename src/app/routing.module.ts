import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { SectorsComponent } from './sectors/sectors.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { LoginComponent } from './login/login.component';
import { ClientDetailComponent } from './clients/client-detail/client-detail.component';
import { AuthGuardService } from './auth-guard.service';
import { MyclientsComponent } from './myclients/myclients.component';
import { TimelineComponent } from './clients/client-detail/timeline/timeline.component';

const routes: Routes = [
  { path: '', redirectTo: '/myclients', pathMatch: 'full' },
  { path: 'clients', component: ClientsComponent, canActivate: [AuthGuardService] },
  { path: 'clients/:id', component: ClientDetailComponent, canActivate: [AuthGuardService] },
  { path: 'sectors', component: SectorsComponent, canActivate: [AuthGuardService] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuardService],    children:[
       //{path:'', component: UserDetailComponent, canActivate: [AuthGuardService] },
       {path:':id', component: UserDetailComponent, canActivate: [AuthGuardService] },
    ] },
  { path: 'myclients', component: MyclientsComponent, canActivate: [AuthGuardService],    children:[
       //{path:'', component: UserDetailComponent, canActivate: [AuthGuardService] },
       {path:':id', component: TimelineComponent, canActivate: [AuthGuardService] },
    ] },
  { path: 'login', component: LoginComponent }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
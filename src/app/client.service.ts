import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class ClientService {

  constructor(private http: Http, private authHttp: AuthHttp) { }

  getAllClients() {
    return this.authHttp.get('/api/clients')
      .timeout(20000)
      .map(res => res.json());
  }
  getUserClients(search) {
    return this.authHttp.get('/api/myclients/'+search)
      .timeout(20000)
      .map(res => res.json());
  }

  getClient(id) {
    return this.authHttp.get('/api/clients/'+id)
      .timeout(20000)
      .map(res => res.json());
  }

  getAllSectors(){
    return this.authHttp.get('/api/sectors')
    .timeout(20000)
		.map(res => res.json());
  }
  getAllUsers(){
    return this.authHttp.get('/api/users')
    .timeout(20000)
		.map(res => res.json());
  }
  
 updateClient(client) {
	let headers = new Headers({ 'Content-Type': 'application/json' });
	let options = new RequestOptions({ headers: headers });
    return this.authHttp.put('/api/clients/'+client._id, client, options)
      .timeout(20000)
      .map(res => res.json());
}
 createClient(client) {
	let headers = new Headers({ 'Content-Type': 'application/json' });
	let options = new RequestOptions({ headers: headers });
    return this.authHttp.post('/api/clients/new', client, options)
      .timeout(20000)
      .map(res => res.json());
}
  deleteClient(id) {
    return this.authHttp.delete('/api/clients/'+id)
      .timeout(20000)
      .map(res => res.json());
  }
  // getClients(): Promise<Client[]> {
  //   return this.http.get('/api/clients')
  //              .toPromise()
  //              .then(response => response.json().data as Client[])
  //              .catch(this.handleError);
  // }
  // private handleError(error: any): Promise<any> {
  //   console.error('An error occurred', error); // for demo purposes only
  //   return Promise.reject(error.message || error);
  // }
}
 
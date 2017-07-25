import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class TimelineService {

  constructor(private authHttp: AuthHttp) { }

  	createTimeline(timeline) {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return this.authHttp.post('/api/timelines', timeline, options)
			.timeout(20000)
	        .map(res => res.json());
	}

	getTimelines(clientId){
		return this.authHttp.get('/api/timelines/'+clientId)
			.timeout(20000)
	      	.map(res => res.json());
	}

	getAllUsers(){
		return this.authHttp.get('/api/users')
			.timeout(20000)
			.map(res => res.json());
  	}

}

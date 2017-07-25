import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class SectorsService {

  constructor(private authHttp: AuthHttp) { }

  getAllSectors(){
    return this.authHttp.get('/api/sectors')
      .timeout(20000)
		  .map(res => res.json());
  }
  updateSector(sector) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
      return this.authHttp.put('/api/sector/'+sector._id, sector, options)
        .timeout(20000)
        .map(res => res.json());
}
  createSector(sector) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
      return this.authHttp.post('/api/sector', sector, options)
        .timeout(20000)
        .map(res => res.json());
}
  deleteSector(id) {
    return this.authHttp.delete('/api/sector/'+id)
      .timeout(20000)
      .map(res => res.json());
  }

}

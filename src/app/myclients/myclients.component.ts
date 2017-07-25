import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { ClientService } from '../client.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-myclients',
  templateUrl: './myclients.component.html',
  styleUrls: ['./myclients.component.css']
})
export class MyclientsComponent implements OnInit {
  clients: any = [];
  error = "";
  searchForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private clientService: ClientService) {
    this.searchForm = new FormGroup({
      'query': new FormControl()
    });

    this.searchForm.get('query').valueChanges
    .distinctUntilChanged()
    .debounceTime(400)
    .subscribe(query => {
      this.clientService.getUserClients(query).subscribe(clients =>this.clients = clients,err=>{
        this.error = err;
        setTimeout(()=>this.error = "",5000);
      });
    });
   }

  ngOnInit() {
    this.clientService.getUserClients('').subscribe(clients =>{
      this.clients = clients;
      this.route.params.subscribe((params: Params) => {
        let id = params['id'];
        if(!id && this.clients[0])this.router.navigate(['myclients', this.clients[0]._id]);
      });
    },err=>{
      this.error = err;
      setTimeout(()=>this.error = "",5000);
    });
  }

  goToClientDetail(id){
    this.router.navigate(['clients', id]);
  }

}

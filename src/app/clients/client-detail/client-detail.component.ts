import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ClientService } from '../../client.service';


@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {
	client: any = {contact:{},sector_id:{},account_manager_id:{}};
	sectors: any = [];
	users: any = [];
	notFound: boolean = false;
	newMode: boolean = false;



  constructor(
	  private route: ActivatedRoute,
	  private router: Router,
	  private clientService: ClientService
	) {}

  ngOnInit() {
  	this.clientService.getAllSectors().subscribe(sectors => {
  	  	this.sectors = sectors;
    });
  	this.clientService.getAllUsers().subscribe(users => {
  	  	this.users = users;
    });
  	this.route.params.subscribe((params: Params) => {
        let id = params['id'];
        if (id == 'new') this.newMode = true;
        else{
        	this.clientService.getClient(id).subscribe(client => {
  	  			this.client = client;
    		},error =>{
		    	this.notFound = true;
		    });
        }
    });
  }

  submitted = false;
 
  onSubmit() { 
  	if(!this.newMode)
		this.clientService.updateClient(this.client)
	    .subscribe(client => {
	    	this.submitted = true;
	    	setTimeout(()=>{this.submitted = false;},1000);
		},error => {
			console.log(error);
		});
   	else
		this.clientService.createClient(this.client)
	    .subscribe(client => {
	    	this.submitted = true;
	    	this.router.navigate(['/clients/'+client._id]);
	    	this.newMode = false;
	    	this.client = client;
	    	setTimeout(()=>{this.submitted = false;},1000);
		},error => {
			console.log(error);
		});
  }

  deleteClient(){
	this.clientService.deleteClient(this.client._id)
    .subscribe(client => {
    	if(client._id == this.client._id)
    		this.router.navigate(['/clients']);
	},error => {
		console.log(error);
	});
  }

}

import { Component, OnInit } from '@angular/core';
import {NgFor} from '@angular/common';
// import { Client } from './client';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
	clients: any = [];
  clientsF: any = [];
  menagers: any = [];
  sectors: any = [];
  clientsColumns: any = [];
  sortBy: String = "";
  sortDirection: String = "";

  constructor(private clientService: ClientService) { }

 //  	getClients(): void {
 //  		this.clientService.getClients().then(clients => this.clients = clients);
	// }

  ngOnInit(): void {
  	//this.getClients();
    this.clientService.getAllClients().subscribe(clients => {
      this.clients = clients;
      this.clientsF = clients;
      for (var i = 0; i < clients.length; ++i) {
        this.menagers.push(clients[i].contact.name);
      }
      for (var i = 0; i < clients.length; ++i) {
        this.sectors.push(clients[i].sector_id.name);
      }
      this.clientsColumns = ['Nazwa firmy', 'Branża', 'Opiekun klienta'];
    });
  }

  filter(searchedName: String,searchedSector: String,searchedMenager: String){
    this.clientsF = this.clients.filter(item => {
      return (item.company_name).includes(searchedName)&&(item.contact.name).includes(searchedMenager)&&(item.sector_id.name).includes(searchedSector);
    });
  }
  sortHeaderClick(headerName: string) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortBy = headerName;
    this.clientsF = this.clientsF.sort(function(a, b):Number {
      switch (headerName) {
        case "Nazwa firmy":
          var nameA = a.company_name.toUpperCase();
          var nameB = b.company_name.toUpperCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        case "Branża":
          var nameA = a.sector_id.name.toUpperCase(); 
          var nameB = b.sector_id.name.toUpperCase(); 
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;  
        case "Opiekun klienta":
          var nameA = a.contact.name.toUpperCase(); 
          var nameB = b.contact.name.toUpperCase(); 
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;  
      }
    });
    if (this.sortDirection == 'desc')this.clientsF = this.clientsF.reverse();
  }

  isSorting(name: string) {
    return this.sortBy == name && name !== '';
  };
 
  isSortAsc(name: string) {
    var isSortAsc: boolean = this.sortBy === name && this.sortDirection === 'asc';
    return isSortAsc;
  };
 
  isSortDesc(name: string) {
    var isSortDesc: boolean = this.sortBy === name && this.sortDirection === 'desc';
    return isSortDesc;
  };


}

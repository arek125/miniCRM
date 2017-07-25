import { Component, OnInit } from '@angular/core';
import { SectorsService } from '../sectors.service';

@Component({
  selector: 'app-sectors',
  template: `
  <div class="alert alert-danger" [hidden]="error==''">
      <strong>Ups..</strong> {{error}}
  </div>
  <ng2-smart-table [settings]="settings" [source]="data" 
  (createConfirm)="createSector($event)"
  (editConfirm)="updateSector($event)"
  (deleteConfirm)="deleteSector($event)"
  ></ng2-smart-table>
  `
})
export class SectorsComponent implements OnInit {

  error="";

  settings = {
    columns: {
      _id: {
        title: 'ID',
        editable: false,
        addable: false
      },
      name: {
        title: 'Branża'
      }
    },
    attr: {
      class: 'table table-bordered'
    },
    noDataMessage: "Brak Danych",
    actions:{
      columnTitle: "Akcje"
    },
    edit:{
      editButtonContent: "Edycja",
      saveButtonContent: "Zapisz",
      cancelButtonContent: "Anuluj",
      confirmSave: true
    },
    add:{
      addButtonContent: "Dodaj",
      createButtonContent: "Utwórz",
      cancelButtonContent: "Anuluj",
      confirmCreate: true
    },
    delete:{
      deleteButtonContent: "Usuń",
      confirmDelete: true
    }
  };
  data:any = [];

  constructor(private sectorsService: SectorsService) { }

  ngOnInit() {
    this.sectorsService.getAllSectors().subscribe(sectors=>this.data=sectors,err=>{this.error=err;setTimeout(()=>this.error="",5000)})
  }

  createSector(event){
    this.sectorsService.createSector(event.newData).subscribe(sector=>event.confirm.resolve(sector),err=>{
      event.confirm.reject();
      this.error = err;
      setTimeout(()=>this.error="",5000);
    })
  }

  updateSector(event){
    this.sectorsService.updateSector(event.newData).subscribe(sector=>event.confirm.resolve(sector),err=>{
      event.confirm.reject();
      this.error = err;
      setTimeout(()=>this.error="",5000);
    })
  }

  deleteSector(event){
    this.sectorsService.deleteSector(event.data._id).subscribe(sector=>event.confirm.resolve(sector),err=>{
      event.confirm.reject();
      this.error = err;
      setTimeout(()=>this.error="",5000);
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TimelineService } from '../../../timeline.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  timeline: any = {};
  timelines: any = [];
  users: any = [];
  submittedTimeline = false;
  notFoundTimelines: boolean = true;
  contact_types: any = {
		"fa-users": {name: "Spotkanie", color: "purple"},
		"fa-file-text-o": {name: "Podpisanie umowy", color: "red"},
        "fa-phone": {name: "Telefon", color: "blue"},
        "fa-envelope-o": {name: "Email", color: "green"}
	}
	type_keys() : Array<string> {
    	return Object.keys(this.contact_types);
  }

  constructor(	  private route: ActivatedRoute,
	  private router: Router,
    private timelineService: TimelineService) { }

  ngOnInit() {
    this.timeline.contact_date = new Date();
    
    this.timelineService.getAllUsers().subscribe(users => {
  	  	this.users = users;
    });
    this.route.params.subscribe((params: Params) => {
      let id = params['id'];
      this.timeline.client_id = id;
      if (id != 'new') {
        this.timelineService.getTimelines(id).subscribe(timelines => {
          this.timelines = timelines;
          if(this.timelines.length)this.notFoundTimelines = false;
        }, error => {
          this.notFoundTimelines = true;
        });
      }
    });
  }
  onSubmitTimeline(form) {
    this.timelineService.createTimeline(this.timeline)
      .subscribe(timeline => {
        this.submittedTimeline = true;
        this.timelines.unshift(timeline);
        this.timelines = this.timelines.sort((a, b) => {
          return new Date(b.contact_date).getTime() - new Date(a.contact_date).getTime();
        });
        form.reset();
        this.timeline.contact_date = new Date();
        setTimeout(() => { this.submittedTimeline = false; }, 1000);
      }, error => {
        console.log(error);
    });
  }

}

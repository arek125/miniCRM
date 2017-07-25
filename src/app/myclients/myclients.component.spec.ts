import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyclientsComponent } from './myclients.component';

describe('MyclientsComponent', () => {
  let component: MyclientsComponent;
  let fixture: ComponentFixture<MyclientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyclientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyclientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

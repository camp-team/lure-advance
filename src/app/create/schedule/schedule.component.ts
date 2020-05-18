import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  startDate: Date = new Date();
  times = new Array(60).map((_, i) => {
    i + 15;
  });

  constructor() {}
  ngOnInit(): void {}
}

interface Time {
  value: string;
}

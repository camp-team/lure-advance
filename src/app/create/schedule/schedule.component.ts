import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  @Input() form: FormGroup;
  seletedDate: FormControl = new FormControl(moment().add(1, 'days'));
  toDay: Date = new Date();
  startDate: Date = moment(this.toDay).add(1, 'days').toDate();
  untilDate: Date = moment(this.toDay).add(6, 'months').toDate();

  currentYear: number = this.toDay.getFullYear();
  currentDate: number = this.toDay.getDate();
  currentMonth: number = this.toDay.getMonth();

  times: Date[] = new Array(96).fill(null).map((_, index) => {
    const currentYear: number = this.toDay.getFullYear();
    const currentDate: number = this.toDay.getDate();
    const currentMonth: number = this.toDay.getMonth();
    const m = (index % 4) * 15;
    const h = (index * 15) / 60;
    return new Date(currentYear, currentMonth, currentDate, h, m);
  });
  selectedTime: Date = this.times[0];
  selectedSetting: boolean = true;

  clear() {}

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {}
}

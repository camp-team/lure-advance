import { Component, OnInit, Input } from '@angular/core';
import { Thing } from '@interfaces/thing';

@Component({
  selector: 'app-thing-card-sm',
  templateUrl: './thing-card-sm.component.html',
  styleUrls: ['./thing-card-sm.component.scss'],
})
export class ThingCardSmComponent implements OnInit {
  @Input() post: Thing;
  constructor() {}

  ngOnInit(): void {}
}

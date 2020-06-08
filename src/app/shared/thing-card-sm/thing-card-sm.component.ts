import { Component, OnInit, Input } from '@angular/core';
import { Thing } from 'src/app/interfaces/thing';

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

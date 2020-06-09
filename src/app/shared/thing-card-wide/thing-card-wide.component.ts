import { Component, OnInit, Input } from '@angular/core';
import { Thing } from 'src/app/interfaces/thing';

@Component({
  selector: 'app-thing-card-wide',
  templateUrl: './thing-card-wide.component.html',
  styleUrls: ['./thing-card-wide.component.scss'],
})
export class ThingCardWideComponent implements OnInit {
  @Input() post: Thing;
  constructor() {}

  ngOnInit(): void {}
}

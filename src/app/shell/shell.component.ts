import { Component, OnInit } from '@angular/core';
import { DrawerService } from '../services/ui/drawer.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  constructor(private drawerService: DrawerService) {}

  isOpen: boolean;
  ngOnInit(): void {
    this.drawerService.isOpen$.subscribe((opend) => (this.isOpen = opend));
  }
}

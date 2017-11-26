import { Component, Input } from '@angular/core';

@Component({
  selector: 'mw-user-icon',
  templateUrl: './mw-user-icon.component.html',
  styleUrls: ['./mw-user-icon.component.scss']
})
export class MwUserIconComponent {
    @Input() letter: string;
    constructor() { }
}

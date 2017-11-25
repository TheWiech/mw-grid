import { Component, Input } from '@angular/core';

@Component({
  selector: 'user-icon',
  templateUrl: './user-icon.component.html',
  styleUrls: ['./user-icon.component.scss']
})
export class UserIconComponent {
    @Input() letter: string;
    constructor() { }
}

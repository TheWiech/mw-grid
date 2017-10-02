import { Component, Input } from '@angular/core';

@Component({
    selector: 'mw-button',
    templateUrl: './mw-button.component.html',
    styleUrls: ['./mw-button.component.scss']
})
export class MwButtonComponent {
    @Input() link: URL;

    constructor() { }
}
